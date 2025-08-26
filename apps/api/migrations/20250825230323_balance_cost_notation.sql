-- +goose Up
-- +goose StatementBegin
-- Up Migration
ALTER TABLE wallets
    ALTER COLUMN balance TYPE BIGINT USING (ROUND(balance * 100));

ALTER TABLE wallets
    ALTER COLUMN locked_balance TYPE BIGINT USING (ROUND(locked_balance * 100));

ALTER TABLE wallets
    ALTER COLUMN balance SET DEFAULT 0;

ALTER TABLE wallets
    ALTER COLUMN locked_balance SET DEFAULT 0;

ALTER TABLE positions
    ALTER COLUMN average_price_per_share TYPE BIGINT USING (ROUND(average_price_per_share * 100));

ALTER TABLE positions
    ALTER COLUMN realized_pnl TYPE BIGINT USING (ROUND(realized_pnl * 100));

ALTER TABLE positions
    ALTER COLUMN realized_pnl SET DEFAULT 0;

ALTER TABLE trades
    ALTER COLUMN price_per_share TYPE BIGINT USING (ROUND(price_per_share * 100));

ALTER TABLE trades
    ALTER COLUMN cost TYPE BIGINT USING (ROUND(cost * 100));

ALTER TABLE transactions
    ALTER COLUMN amount TYPE BIGINT USING (ROUND(amount * 100));


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
-- Down Migration
ALTER TABLE wallets
    ALTER COLUMN balance TYPE NUMERIC(20,10) USING (balance::NUMERIC / 100);

ALTER TABLE wallets
    ALTER COLUMN locked_balance TYPE NUMERIC(20,10) USING (locked_balance::NUMERIC / 100);

ALTER TABLE wallets
    ALTER COLUMN balance SET DEFAULT 0;

ALTER TABLE wallets
    ALTER COLUMN locked_balance SET DEFAULT 0;

ALTER TABLE positions
    ALTER COLUMN average_price_per_share TYPE NUMERIC(20,10) USING (average_price_per_share::NUMERIC / 100);

ALTER TABLE positions
    ALTER COLUMN realized_pnl TYPE NUMERIC(20,10) USING (realized_pnl::NUMERIC / 100);

ALTER TABLE positions
    ALTER COLUMN realized_pnl SET DEFAULT 0;

ALTER TABLE trades
    ALTER COLUMN price_per_share TYPE NUMERIC(20,10) USING (price_per_share::NUMERIC / 100);

ALTER TABLE trades
    ALTER COLUMN cost TYPE NUMERIC(20,10) USING (cost::NUMERIC / 100);

ALTER TABLE transactions
    ALTER COLUMN amount TYPE NUMERIC(20,10) USING (amount::NUMERIC / 100);


-- +goose StatementEnd
