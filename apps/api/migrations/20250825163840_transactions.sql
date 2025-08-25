-- +goose Up
-- +goose StatementBegin
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE, -- User id is TEXT from better auth
    amount NUMERIC(20,10) NOT NULL, -- Positive for deposits, negative for withdrawals
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('BUY', 'SELL', 'SETTLEMENT', 'ADMIN_RESET', 'ADMIN_ADJUSTMENT')),
    
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
-- +goose StatementEnd
