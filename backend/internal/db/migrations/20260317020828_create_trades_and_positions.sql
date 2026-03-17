-- +goose Up

-- +goose StatementBegin
-- ── Trades ────────────────────────────────────────────────────────────────────
-- Immutable record of every buy/sell action against the LMSR market maker.
CREATE TABLE trades (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    market_id       UUID            NOT NULL REFERENCES markets(id) ON DELETE RESTRICT,
    user_id         UUID            NOT NULL REFERENCES users(id)   ON DELETE RESTRICT,
    outcome         market_outcome  NOT NULL,
    -- Positive = buy, negative = sell (in shares, stored as fixed-point cents)
    shares          BIGINT          NOT NULL,
    -- Cost paid (positive) or received (negative) in cents — derived from LMSR cost function
    cost            BIGINT          NOT NULL,
    -- Snapshot of aggregate market q BEFORE this trade (for audit / replay)
    shares_higher_before    BIGINT  NOT NULL,
    shares_lower_before     BIGINT  NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT trades_nonzero_shares CHECK (shares <> 0)
);

-- Composite index covers both market-only and market+user lookups
CREATE INDEX idx_trades_market_user ON trades (market_id, user_id);
CREATE INDEX idx_trades_user        ON trades (user_id);

-- ── Positions ─────────────────────────────────────────────────────────────────
-- Materialized net shares per user per market — updated within the same
-- transaction as every trade. Used at resolution for bulk payout calculation.
-- total_spent is intentionally dropped — derive from SUM(cost) on trades.
CREATE TABLE positions (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID            NOT NULL REFERENCES users(id)   ON DELETE RESTRICT,
    market_id       UUID            NOT NULL REFERENCES markets(id) ON DELETE RESTRICT,
    shares_higher   BIGINT          NOT NULL DEFAULT 0,
    shares_lower    BIGINT          NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    CONSTRAINT positions_unique_user_market UNIQUE (user_id, market_id),
    CONSTRAINT positions_no_negative_higher CHECK (shares_higher >= 0),
    CONSTRAINT positions_no_negative_lower  CHECK (shares_lower  >= 0)
);

CREATE INDEX idx_positions_user    ON positions (user_id);
CREATE INDEX idx_positions_market  ON positions (market_id);

CREATE TRIGGER set_positions_updated_at
    BEFORE UPDATE ON positions
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS set_positions_updated_at ON positions;
DROP INDEX IF EXISTS idx_positions_market;
DROP INDEX IF EXISTS idx_positions_user;
DROP TABLE IF EXISTS positions;
DROP INDEX IF EXISTS idx_trades_user;
DROP INDEX IF EXISTS idx_trades_market_user;
DROP TABLE IF EXISTS trades;
-- +goose StatementEnd
