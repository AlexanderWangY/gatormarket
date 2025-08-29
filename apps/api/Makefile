include .env

migrate-up:
	@goose -dir ./migrations postgres ${DATABASE_URL} up

migrate-down:
	@goose -dir ./migrations postgres ${DATABASE_URL} down

setup:
	pnpm i
	npx @better-auth/cli migrate --config ./src/config/auth.ts
	make migrate-up
