-- +goose Up
-- +goose StatementBegin
CREATE TYPE trade_type_enum AS ENUM ('BUY', 'SELL');

CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outcome_id UUID NOT NULL REFERENCES outcomes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    trade_type trade_type_enum NOT NULL,
    shares NUMERIC(20,10) NOT NULL,
    price_per_share INTEGER NOT NULL,
    cost INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Add constraint to ensure never negative quantity and price
    CONSTRAINT chk_shares_positive CHECK (shares > 0),
    CONSTRAINT chk_price_positive CHECK (price_per_share > 0)
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS trades;
DROP TYPE IF EXISTS trade_type_enum;
-- +goose StatementEnd
