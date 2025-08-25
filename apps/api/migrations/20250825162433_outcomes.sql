-- +goose Up
-- +goose StatementBegin
CREATE TABLE outcomes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    market_id INT NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    label TEXT NOT NULL CHECK (label IN ('YES', 'NO')),
    shares NUMERIC(20,10) NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Add constraint to ensure never negative securities
    CONSTRAINT chk_shares_nonnegative CHECK (shares >= 0),
    UNIQUE(market_id, label)
);

CREATE INDEX idx_outcomes_market_id ON outcomes(market_id);
CREATE INDEX idx_outcomes_shares ON outcomes(shares);
-- Auto update updated_at on row update
CREATE TRIGGER update_outcomes_updated_at
BEFORE UPDATE ON outcomes
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_outcomes_market_id;
DROP INDEX IF EXISTS idx_outcomes_shares;

DROP TRIGGER IF EXISTS update_outcomes_updated_at ON outcomes;
DROP TABLE IF EXISTS outcomes;

-- +goose StatementEnd
