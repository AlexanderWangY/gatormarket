package main

import (
	"context"
	"log"

	"github.com/AlexanderWangY/gatormarket/backend/internal/config"
	"github.com/AlexanderWangY/gatormarket/backend/internal/db"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	if err := db.RunMigrations(cfg.DatabaseURL); err != nil {
		log.Fatalf("failed to run migrations: %v", err)
	}

	log.Println("migrations applied successfully")

	ctx := context.Background()

	database := db.NewDB(cfg.DatabaseURL)
	defer database.Close()

	_ = ctx
	_ = database

	// TODO: start HTTP server
}
