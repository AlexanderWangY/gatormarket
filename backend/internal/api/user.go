package api

import (
	"net/http"

	"github.com/AlexanderWangY/gatormarket/backend/internal/middleware"
	"github.com/AlexanderWangY/gatormarket/backend/internal/service"
)

type UserHandler struct {
	users *service.UserService
}

func NewUserHandler(users *service.UserService) *UserHandler {
	return &UserHandler{users: users}
}

func (h *UserHandler) HandleMe(w http.ResponseWriter, r *http.Request) {
	claims := middleware.GetClaims(r)
	if claims == nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"id":    claims.Subject,
		"email": claims.Email,
		"role":  claims.Role,
	})
}
