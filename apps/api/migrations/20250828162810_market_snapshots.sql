-- +goose Up
-- +goose StatementBegin
CREATE TABLE market_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_id INT NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    yes_shares NUMERIC(20,10) NOT NULL,
    no_shares NUMERIC(20,10) NOT NULL,
    yes_price_cents BIGINT NOT NULL,
    no_price_cents BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_market_snapshots_market_id ON market_snapshots(market_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS market_snapshots;
-- +goose StatementEnd
