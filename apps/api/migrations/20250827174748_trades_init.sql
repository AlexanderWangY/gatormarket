-- +goose Up
-- +goose StatementBegin
CREATE TYPE trade_type AS ENUM ('BUY', 'SELL');

CREATE TABLE trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    market_id INT NOT NULL REFERENCES markets(id) ON DELETE CASCADE,
    outcome outcome_result_type NOT NULL,
    trade_type trade_type NOT NULL,
    shares NUMERIC(20,10) NOT NULL,
    amount_cents BIGINT NOT NULL,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trades_user_id ON trades(user_id);
CREATE INDEX idx_trades_market_id ON trades(market_id);
CREATE INDEX idx_trades_user_market ON trades(user_id, market_id);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TABLE IF EXISTS trades;
DROP TYPE IF EXISTS trade_type;
-- +goose StatementEnd
