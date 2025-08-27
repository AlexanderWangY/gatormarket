-- +goose Up
-- +goose StatementBegin
CREATE TYPE transaction_type_enum AS ENUM ('BUY', 'SELL', 'SETTLEMENT', 'ADMIN_RESET', 'ADMIN_ADJUSTMENT');

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE, -- User id is TEXT from better auth
    amount INTEGER NOT NULL, -- Positive for deposits, negative for withdrawals
    transaction_type transaction_type_enum NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto update updated_at on row update
CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON transactions
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TRIGGER IF EXISTS update_transactions_updated_at ON transactions;
DROP TABLE IF EXISTS transactions;
DROP TYPE IF EXISTS transaction_type_enum;
-- +goose StatementEnd
