-- +goose Up
-- +goose StatementBegin
ALTER TABLE "user"
ADD COLUMN balance_cents BIGINT NOT NULL DEFAULT 0;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE "user"
DROP COLUMN IF EXISTS balance_cents;
-- +goose StatementEnd
