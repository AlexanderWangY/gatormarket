-- +goose Up
-- +goose StatementBegin

CREATE TYPE outcome_result_type AS ENUM ('YES', 'NO');

CREATE TABLE markets (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    question TEXT NOT NULL,
    semester TEXT NOT NULL,
    closes_at TIMESTAMPTZ NOT NULL,
    liquidity BIGINT NOT NULL DEFAULT 25000,
    resolved BOOLEAN NOT NULL DEFAULT FALSE,
    outcome outcome_result_type,

    -- Shares
    yes_shares NUMERIC(20,10) NOT NULL DEFAULT 0,
    no_shares NUMERIC(20,10) NOT NULL DEFAULT 0,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- function to update updated_at column on update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_markets_updated_at
BEFORE UPDATE ON markets
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS update_markets_updated_at ON markets;
DROP FUNCTION IF EXISTS update_updated_at_column;
DROP TABLE IF EXISTS markets;
DROP TYPE IF EXISTS outcome_result_type;
-- +goose StatementEnd
