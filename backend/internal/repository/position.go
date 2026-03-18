package repository

import (
	"github.com/AlexanderWangY/gatormarket/backend/internal/db"
)

type PositionRepository struct {
	db *db.DB
}

func NewPositionRepository(db *db.DB) *PositionRepository {
	return &PositionRepository{db: db}
}
