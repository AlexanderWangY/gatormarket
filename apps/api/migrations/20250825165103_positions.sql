-- +goose Up
-- +goose StatementBegin
CREATE TABLE positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    outcome_id UUID NOT NULL REFERENCES outcomes(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    shares NUMERIC(20,10) NOT NULL,
    average_price_per_share NUMERIC(20,10) NOT NULL,
    realized_pnl NUMERIC(20,10) NOT NULL DEFAULT 0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Add constraint to ensure never negative quantity and price
    CONSTRAINT chk_shares_nonnegative CHECK (shares >= 0),
    CONSTRAINT chk_price_nonnegative CHECK (average_price_per_share >= 0),
    
    UNIQUE (outcome_id, user_id)
);

-- Auto update updated_at on row update
CREATE TRIGGER update_positions_updated_at
BEFORE UPDATE ON positions
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS update_positions_updated_at ON positions;
DROP TABLE IF EXISTS positions;
-- +goose StatementEnd
