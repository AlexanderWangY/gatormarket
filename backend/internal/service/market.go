package service

import (
	"context"

	"github.com/AlexanderWangY/gatormarket/backend/internal/db/sqlc"
	"github.com/AlexanderWangY/gatormarket/backend/internal/repository"
	"github.com/google/uuid"
)

type MarketService struct {
	repo *repository.MarketRepository
}

func NewMarketService(repo *repository.MarketRepository) *MarketService {
	return &MarketService{repo: repo}
}

func (s *MarketService) Create(ctx context.Context, arg sqlc.CreateMarketParams) (sqlc.Market, error) {
	return s.repo.Create(ctx, arg)
}

func (s *MarketService) GetByID(ctx context.Context, id uuid.UUID) (sqlc.Market, error) {
	return s.repo.GetByID(ctx, id)
}

func (s *MarketService) List(ctx context.Context) ([]sqlc.Market, error) {
	return s.repo.List(ctx)
}

func (s *MarketService) ListOpen(ctx context.Context) ([]sqlc.Market, error) {
	return s.repo.ListOpen(ctx)
}

func (s *MarketService) ListByStatus(ctx context.Context, status sqlc.MarketStatus) ([]sqlc.Market, error) {
	return s.repo.ListByStatus(ctx, status)
}

func (s *MarketService) ListByCourse(ctx context.Context, courseCode string) ([]sqlc.Market, error) {
	return s.repo.ListByCourse(ctx, courseCode)
}

func (s *MarketService) ListByCreator(ctx context.Context, creatorID uuid.UUID) ([]sqlc.Market, error) {
	return s.repo.ListByCreator(ctx, creatorID)
}

func (s *MarketService) UpdateStatus(ctx context.Context, arg sqlc.UpdateMarketStatusParams) (sqlc.Market, error) {
	return s.repo.UpdateStatus(ctx, arg)
}

func (s *MarketService) UpdateShares(ctx context.Context, arg sqlc.UpdateMarketSharesParams) (sqlc.Market, error) {
	return s.repo.UpdateShares(ctx, arg)
}

func (s *MarketService) Resolve(ctx context.Context, arg sqlc.ResolveMarketParams) (sqlc.Market, error) {
	return s.repo.Resolve(ctx, arg)
}

func (s *MarketService) Delete(ctx context.Context, id uuid.UUID) error {
	return s.repo.Delete(ctx, id)
}
