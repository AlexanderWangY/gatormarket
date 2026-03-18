package service

import (
	"github.com/AlexanderWangY/gatormarket/backend/internal/repository"
)

type TradeService struct {
	repo *repository.TradeRepository
}

func NewTradeService(repo *repository.TradeRepository) *TradeService {
	return &TradeService{repo: repo}
}
