-- +goose Up
-- +goose StatementBegin
CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outcome_id UUID NOT NULL REFERENCES outcomes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    trade_type TEXT NOT NULL CHECK (trade_type IN ('BUY', 'SELL')),
    shares NUMERIC(20,10) NOT NULL,
    price_per_share NUMERIC(20,10) NOT NULL,
    cost NUMERIC(20,10) NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Add constraint to ensure never negative quantity and price
    CONSTRAINT chk_shares_positive CHECK (shares > 0),
    CONSTRAINT chk_price_positive CHECK (price_per_share > 0)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS trades;
-- +goose StatementEnd
