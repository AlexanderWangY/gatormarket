package repository

import (
	"context"

	"github.com/AlexanderWangY/gatormarket/backend/internal/db"
	"github.com/AlexanderWangY/gatormarket/backend/internal/db/sqlc"
	"github.com/google/uuid"
)

type MarketRepository struct {
	db *db.DB
}

func NewMarketRepository(db *db.DB) *MarketRepository {
	return &MarketRepository{db: db}
}

func (r *MarketRepository) Create(ctx context.Context, arg sqlc.CreateMarketParams) (sqlc.Market, error) {
	return r.db.Queries.CreateMarket(ctx, arg)
}

func (r *MarketRepository) GetByID(ctx context.Context, id uuid.UUID) (sqlc.Market, error) {
	return r.db.Queries.GetMarketByID(ctx, id)
}

func (r *MarketRepository) List(ctx context.Context) ([]sqlc.Market, error) {
	return r.db.Queries.ListMarkets(ctx)
}

func (r *MarketRepository) ListOpen(ctx context.Context) ([]sqlc.Market, error) {
	return r.db.Queries.ListOpenMarkets(ctx)
}

func (r *MarketRepository) ListByStatus(ctx context.Context, status sqlc.MarketStatus) ([]sqlc.Market, error) {
	return r.db.Queries.ListMarketsByStatus(ctx, status)
}

func (r *MarketRepository) ListByCourse(ctx context.Context, courseCode string) ([]sqlc.Market, error) {
	return r.db.Queries.ListMarketsByCourse(ctx, courseCode)
}

func (r *MarketRepository) ListByCreator(ctx context.Context, creatorID uuid.UUID) ([]sqlc.Market, error) {
	return r.db.Queries.ListMarketsByCreator(ctx, creatorID)
}

func (r *MarketRepository) UpdateStatus(ctx context.Context, arg sqlc.UpdateMarketStatusParams) (sqlc.Market, error) {
	return r.db.Queries.UpdateMarketStatus(ctx, arg)
}

func (r *MarketRepository) UpdateShares(ctx context.Context, arg sqlc.UpdateMarketSharesParams) (sqlc.Market, error) {
	return r.db.Queries.UpdateMarketShares(ctx, arg)
}

func (r *MarketRepository) Resolve(ctx context.Context, arg sqlc.ResolveMarketParams) (sqlc.Market, error) {
	return r.db.Queries.ResolveMarket(ctx, arg)
}

func (r *MarketRepository) Delete(ctx context.Context, id uuid.UUID) error {
	return r.db.Queries.DeleteMarket(ctx, id)
}
