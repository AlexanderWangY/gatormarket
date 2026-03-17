package db

import (
	"context"
	"fmt"
	"log"

	"github.com/AlexanderWangY/gatormarket/backend/internal/db/sqlc"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type DB struct {
	pool    *pgxpool.Pool // Private pool
	Conn    sqlc.DBTX     // Public Connection
	Queries *sqlc.Queries // Public queries from sqlc
}

func NewDB(connStr string) *DB {
	pool, err := pgxpool.New(context.Background(), connStr)
	if err != nil {
		log.Fatal(err)
	}

	query := sqlc.New(pool)

	db := DB{
		pool:    pool,
		Conn:    pool,
		Queries: query,
	}

	return &db
}

func (d *DB) WithTx(ctx context.Context, fn func(db *DB) error) error {
	tx, err := d.pool.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		return fmt.Errorf("begin tx: %w", err)
	}

	defer func() {
		if p := recover(); p != nil {
			_ = tx.Rollback(ctx)
			panic(p)
		}
	}()

	txDB := &DB{
		pool:    d.pool,
		Conn:    tx,
		Queries: d.Queries.WithTx(tx),
	}

	if err := fn(txDB); err != nil {
		_ = tx.Rollback(ctx)
		return err
	}

	return tx.Commit(ctx)
}

func (d *DB) Close() {
	d.pool.Close()
}
