-- +goose Up
-- +goose StatementBegin
ALTER TABLE transactions
ADD COLUMN trade_id UUID REFERENCES trades(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE transactions
ADD COLUMN related_outcome_id UUID REFERENCES outcomes(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED; -- Used for settling transactions related to specific outcomes, like in trades.
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE transactions
DROP COLUMN IF EXISTS trade_id;

ALTER TABLE transactions
DROP COLUMN IF EXISTS related_outcome_id;
-- +goose StatementEnd
