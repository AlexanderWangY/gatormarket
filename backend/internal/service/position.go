package service

import (
	"github.com/AlexanderWangY/gatormarket/backend/internal/repository"
)

type PositionService struct {
	repo *repository.PositionRepository
}

func NewPositionService(repo *repository.PositionRepository) *PositionService {
	return &PositionService{repo: repo}
}
