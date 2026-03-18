package repository

import (
	"context"

	"github.com/AlexanderWangY/gatormarket/backend/internal/db"
	"github.com/AlexanderWangY/gatormarket/backend/internal/db/sqlc"
	"github.com/google/uuid"
)

type UserRepository struct {
	db *db.DB
}

func NewUserRepository(db *db.DB) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, arg sqlc.CreateUserParams) (sqlc.User, error) {
	return r.db.Queries.CreateUser(ctx, arg)
}

func (r *UserRepository) GetByID(ctx context.Context, id uuid.UUID) (sqlc.User, error) {
	return r.db.Queries.GetUserByID(ctx, id)
}

func (r *UserRepository) GetByEmail(ctx context.Context, email string) (sqlc.User, error) {
	return r.db.Queries.GetUserByEmail(ctx, email)
}

func (r *UserRepository) GetByVerifyToken(ctx context.Context, token *string) (sqlc.User, error) {
	return r.db.Queries.GetUserByVerifyToken(ctx, token)
}

func (r *UserRepository) List(ctx context.Context) ([]sqlc.User, error) {
	return r.db.Queries.ListUsers(ctx)
}

func (r *UserRepository) UpdateProfile(ctx context.Context, arg sqlc.UpdateUserProfileParams) (sqlc.User, error) {
	return r.db.Queries.UpdateUserProfile(ctx, arg)
}

func (r *UserRepository) UpdatePassword(ctx context.Context, arg sqlc.UpdatePasswordParams) error {
	return r.db.Queries.UpdatePassword(ctx, arg)
}

func (r *UserRepository) UpdateRole(ctx context.Context, arg sqlc.UpdateUserRoleParams) (sqlc.User, error) {
	return r.db.Queries.UpdateUserRole(ctx, arg)
}

func (r *UserRepository) SetEmailVerified(ctx context.Context, id uuid.UUID) (sqlc.User, error) {
	return r.db.Queries.SetEmailVerified(ctx, id)
}

func (r *UserRepository) SetEmailVerifyToken(ctx context.Context, arg sqlc.SetEmailVerifyTokenParams) (sqlc.User, error) {
	return r.db.Queries.SetEmailVerifyToken(ctx, arg)
}

func (r *UserRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.Queries.DeleteUser(ctx, id)
}
