-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE FUNCTION create_wallet_for_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO wallets(user_id, balance, locked_balance)
    VALUES (NEW.id, 0, 0);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_wallet
AFTER INSERT ON "user"
FOR EACH ROW
EXECUTE FUNCTION create_wallet_for_user();


-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP TRIGGER IF EXISTS trigger_create_wallet ON "user";
DROP FUNCTION IF EXISTS create_wallet_for_user;

-- +goose StatementEnd
