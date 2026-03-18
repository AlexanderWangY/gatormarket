package main

import (
	"fmt"
	"log"
	"net/http"

	"github.com/AlexanderWangY/gatormarket/backend/internal/api"
	"github.com/AlexanderWangY/gatormarket/backend/internal/config"
	"github.com/AlexanderWangY/gatormarket/backend/internal/db"
	"github.com/AlexanderWangY/gatormarket/backend/internal/repository"
	"github.com/AlexanderWangY/gatormarket/backend/internal/service"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	database := db.NewDB(cfg.DatabaseURL)
	defer database.Close()

	// Repositories
	userRepo := repository.NewUserRepository(database)
	marketRepo := repository.NewMarketRepository(database)

	// Services
	emailSvc := service.NewEmailService(cfg.ResendAPIKey, "verify@auth.gatormarket.com")
	authSvc := service.NewAuthService(database, userRepo, emailSvc, cfg.JWTSecret, cfg.BaseURL)
	marketSvc := service.NewMarketService(marketRepo)
	userSvc := service.NewUserService(userRepo)

	// Handlers
	authHandler := api.NewAuthHandler(authSvc)
	marketHandler := api.NewMarketHandler(marketSvc)
	userHandler := api.NewUserHandler(userSvc)

	// Router
	router := api.NewRouter(authHandler, marketHandler, userHandler, cfg.JWTSecret)

	addr := fmt.Sprintf(":%d", cfg.Port)
	log.Printf("server listening on %s", addr)
	log.Fatal(http.ListenAndServe(addr, router))
}
