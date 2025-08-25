-- +goose Up
-- +goose StatementBegin

-- Auto update updated_at on row update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';


-- Status enums
CREATE TYPE market_status AS ENUM ('active', 'inactive', 'settled', 'cancelled');

CREATE TABLE markets (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    title TEXT NOT NULL,
    description TEXT,
    course_code TEXT NOT NULL,
    exam_name TEXT NOT NULL,
    exam_start_time TIMESTAMPTZ NOT NULL,
    exam_end_time TIMESTAMPTZ NOT NULL,
    status market_status NOT NULL DEFAULT 'active',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_markets_status ON markets(status);

CREATE TRIGGER update_markets_updated_at
BEFORE UPDATE ON markets
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

DROP INDEX IF EXISTS idx_markets_status;
DROP TRIGGER IF EXISTS update_markets_updated_at ON markets;
DROP FUNCTION IF EXISTS update_updated_at_column;

DROP TABLE IF EXISTS markets;
DROP TYPE IF EXISTS market_status;
-- +goose StatementEnd
