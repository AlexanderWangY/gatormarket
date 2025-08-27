-- +goose Up
-- +goose StatementBegin
CREATE OR REPLACE FUNCTION create_default_outcomes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO outcomes(market_id, outcome)
    VALUES
        (NEW.id, 'YES'),
        (NEW.id, 'NO');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on markets AFTER INSERT
CREATE TRIGGER trg_create_outcomes
AFTER INSERT ON markets
FOR EACH ROW
EXECUTE PROCEDURE create_default_outcomes();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS trg_create_outcomes ON markets;
DROP FUNCTION IF EXISTS create_default_outcomes;
-- +goose StatementEnd
