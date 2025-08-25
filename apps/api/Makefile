include .env

migrate-up:
	@goose -dir ./migrations postgres ${DATABASE_URL} up

migrate-down:
	@goose -dir ./migrations postgres ${DATABASE_URL} down
