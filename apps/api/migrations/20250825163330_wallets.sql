-- +goose Up
-- +goose StatementBegin
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE, -- User id is TEXT from better auth
    balance NUMERIC(20,10) NOT NULL DEFAULT 0,
    locked_balance NUMERIC(20,10) NOT NULL DEFAULT 0, -- Funds reserved for open trades

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Add constraint to ensure never negative balance
    CONSTRAINT chk_balance_nonnegative CHECK (balance >= 0),
    UNIQUE(user_id)
);

-- Auto update updated_at on row update
CREATE TRIGGER update_wallets_updated_at
BEFORE UPDATE ON wallets
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS update_wallets_updated_at ON wallets;
DROP TABLE IF EXISTS wallets;
-- +goose StatementEnd
