DB_URL    := postgres://postgres:postgres@localhost:5432/gatormarket_db?sslmode=disable
GOOSE_DIR := internal/db/migrations

.PHONY: help
help:
	@echo "Usage:"
	@echo "  make migrate-up              Run all pending migrations against the local Docker postgres"
	@echo "  make migrate-down            Roll back the last migration"
	@echo "  make migrate-reset           Roll back all migrations"
	@echo "  make migrate-status          Show migration status"
	@echo "  make migrate-create name=x   Create a new migration file"
	@echo "  make validate                Run up + reset to verify all migrations and rollbacks"
	@echo "  make sqlc                    Generate sqlc code (requires running backend container)"
	@echo "  make build                   Build the server binary"

# ── Goose (local dev — targets the Docker postgres on localhost:5432) ─────────

.PHONY: migrate-up
migrate-up:
	goose -dir $(GOOSE_DIR) postgres "$(DB_URL)" up

.PHONY: migrate-down
migrate-down:
	goose -dir $(GOOSE_DIR) postgres "$(DB_URL)" down

.PHONY: migrate-reset
migrate-reset:
	goose -dir $(GOOSE_DIR) postgres "$(DB_URL)" reset

.PHONY: migrate-status
migrate-status:
	goose -dir $(GOOSE_DIR) postgres "$(DB_URL)" status

.PHONY: migrate-create
migrate-create:
	@[ -n "$(name)" ] || (echo "Usage: make migrate-create name=<migration_name>"; exit 1)
	goose -dir $(GOOSE_DIR) create $(name) sql

# ── Validate (mirrors CI — run before pushing) ────────────────────────────────

.PHONY: validate
validate:
	goose -dir $(GOOSE_DIR) postgres "$(DB_URL)" up
	goose -dir $(GOOSE_DIR) postgres "$(DB_URL)" reset
	@echo "All migrations and rollbacks validated."

# ── sqlc ──────────────────────────────────────────────────────────────────────

.PHONY: sqlc
sqlc:
	docker compose -f ../docker-compose.yml exec backend sqlc generate

# ── Build ─────────────────────────────────────────────────────────────────────

.PHONY: build
build:
	CGO_ENABLED=0 go build -o bin/server ./cmd/server/...
