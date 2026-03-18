package service

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"errors"
	"fmt"
	"net/http"
	"net/mail"
	"strings"
	"time"

	"github.com/AlexanderWangY/gatormarket/backend/internal/db"
	"github.com/AlexanderWangY/gatormarket/backend/internal/db/sqlc"
	"github.com/AlexanderWangY/gatormarket/backend/internal/repository"
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/argon2"
)

var (
	ErrEmailInvalid        = errors.New("invalid email address")
	ErrEmailTaken          = errors.New("email already in use")
	ErrPasswordTooShort    = errors.New("password must be at least 8 characters")
	ErrTokenSign           = errors.New("failed to sign token")
	ErrInvalidCredentials  = errors.New("invalid credentials")
	ErrEmailNotVerified    = errors.New("email not verified")
)

type AuthService struct {
	db        *db.DB
	userRepo  *repository.UserRepository
	email     *EmailService
	jwtSecret string
	baseURL   string
}

func NewAuthService(db *db.DB, userRepo *repository.UserRepository, email *EmailService, jwtSecret, baseURL string) *AuthService {
	return &AuthService{
		db:        db,
		userRepo:  userRepo,
		email:     email,
		jwtSecret: jwtSecret,
		baseURL:   baseURL,
	}
}

func hashPassword(password string) (string, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", fmt.Errorf("salt: %w", err)
	}
	key := argon2.IDKey([]byte(password), salt, 3, 64*1024, 4, 32)
	encoded := base64.RawStdEncoding.EncodeToString(salt) + ":" + base64.RawStdEncoding.EncodeToString(key)
	return encoded, nil
}

func verifyPassword(password, encoded string) bool {
	parts := strings.SplitN(encoded, ":", 2)
	if len(parts) != 2 {
		return false
	}
	salt, err := base64.RawStdEncoding.DecodeString(parts[0])
	if err != nil {
		return false
	}
	expectedKey, err := base64.RawStdEncoding.DecodeString(parts[1])
	if err != nil {
		return false
	}
	key := argon2.IDKey([]byte(password), salt, 3, 64*1024, 4, 32)
	if len(key) != len(expectedKey) {
		return false
	}
	var diff byte
	for i := range key {
		diff |= key[i] ^ expectedKey[i]
	}
	return diff == 0
}

func (s *AuthService) Register(ctx context.Context, email, password string) error {
	if _, err := mail.ParseAddress(email); err != nil {
		return ErrEmailInvalid
	}

	if len(password) < 8 {
		return ErrPasswordTooShort
	}

	_, err := s.userRepo.GetByEmail(ctx, email)
	if err == nil {
		return ErrEmailTaken
	}

	if !errors.Is(err, pgx.ErrNoRows) {
		return fmt.Errorf("check email: %w", err)
	}

	hash, err := hashPassword(password)
	if err != nil {
		return err
	}

	user, err := s.userRepo.Create(ctx, sqlc.CreateUserParams{
		Email:        email,
		PasswordHash: hash,
		DisplayName:  nil,
	})
	if err != nil {
		return fmt.Errorf("user creation: %w", err)
	}

	tokenBytes := make([]byte, 32)
	if _, err = rand.Read(tokenBytes); err != nil {
		return fmt.Errorf("verify token: %w", err)
	}
	token := hex.EncodeToString(tokenBytes)

	_, err = s.userRepo.SetEmailVerifyToken(ctx, sqlc.SetEmailVerifyTokenParams{
		ID:               user.ID,
		EmailVerifyToken: &token,
	})
	if err != nil {
		return fmt.Errorf("set verify token: %w", err)
	}

	if err = s.email.SendVerification(email, token, s.baseURL); err != nil {
		return fmt.Errorf("send verification email: %w", err)
	}

	return nil
}

func (s *AuthService) Login(ctx context.Context, email, password string) (string, error) {
	user, err := s.userRepo.GetByEmail(ctx, email)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return "", ErrInvalidCredentials
		}
		return "", fmt.Errorf("get user: %w", err)
	}

	if !verifyPassword(password, user.PasswordHash) {
		return "", ErrInvalidCredentials
	}

	now := time.Now()
	claims := jwt.MapClaims{
		"sub":   user.ID.String(),
		"email": user.Email,
		"role":  string(user.Role),
		"exp":   now.Add(24 * time.Hour).Unix(),
		"iat":   now.Unix(),
	}

	t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := t.SignedString([]byte(s.jwtSecret))
	if err != nil {
		return "", ErrTokenSign
	}

	return signed, nil
}

func (s *AuthService) VerifyEmail(ctx context.Context, token string) error {
	user, err := s.userRepo.GetByVerifyToken(ctx, &token)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrInvalidCredentials
		}
		return fmt.Errorf("get user by token: %w", err)
	}

	_, err = s.userRepo.SetEmailVerified(ctx, user.ID)
	if err != nil {
		return fmt.Errorf("set email verified: %w", err)
	}

	return nil
}

func SetAuthCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "gm_jwt",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteLaxMode,
		MaxAge:   int((24 * time.Hour).Seconds()),
	})
}
