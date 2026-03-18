package api

import (
	"net/http"

	"github.com/AlexanderWangY/gatormarket/backend/internal/middleware"
)

func NewRouter(auth *AuthHandler, markets *MarketHandler, users *UserHandler, jwtSecret string) http.Handler {
	mux := http.NewServeMux()

	// Public auth routes
	mux.HandleFunc("POST /api/auth/register", auth.HandleRegister)
	mux.HandleFunc("POST /api/auth/login", auth.HandleLogin)
	mux.HandleFunc("GET /api/auth/verify", auth.HandleVerifyEmail)

	// Protected market routes
	requireAuth := middleware.RequireAuth(jwtSecret)
	mux.Handle("GET /api/markets", chain(markets.HandleList, requireAuth))
	mux.Handle("GET /api/markets/{id}", chain(markets.HandleGetByID, requireAuth))
	mux.Handle("POST /api/markets", chain(markets.HandleCreate, requireAuth))
	mux.Handle("DELETE /api/markets/{id}", chain(markets.HandleDelete, requireAuth))

	// Protected user routes
	mux.Handle("GET /api/me", chain(users.HandleMe, requireAuth))

	return mux
}

// chain applies middleware in order so the first middleware is outermost.
func chain(h http.HandlerFunc, mw ...func(http.Handler) http.Handler) http.Handler {
	var handler http.Handler = h
	for i := len(mw) - 1; i >= 0; i-- {
		handler = mw[i](handler)
	}
	return handler
}
