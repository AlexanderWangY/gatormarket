-- +goose Up
-- +goose StatementBegin
ALTER TABLE markets
ADD COLUMN liquidity INT NOT NULL DEFAULT 25000;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE markets
DROP COLUMN liquidity;
-- +goose StatementEnd
