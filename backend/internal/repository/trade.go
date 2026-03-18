package repository

import (
	"github.com/AlexanderWangY/gatormarket/backend/internal/db"
)

type TradeRepository struct {
	db *db.DB
}

func NewTradeRepository(db *db.DB) *TradeRepository {
	return &TradeRepository{db: db}
}
