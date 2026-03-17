-- +goose Up

-- +goose StatementBegin
CREATE TYPE market_status  AS ENUM ('open', 'closed', 'under_review', 'resolved', 'cancelled');
CREATE TYPE market_outcome AS ENUM ('higher', 'lower');

CREATE TABLE markets (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id      UUID            NOT NULL REFERENCES users(id) ON DELETE RESTRICT,

    -- Market info
    title           TEXT            NOT NULL,
    course_code     TEXT            NOT NULL,
    exam_name       VARCHAR(100)    NOT NULL,
    exam_date       DATE            NOT NULL,

    -- Benchmark: last semester's class average
    -- Stored as integer basis points (e.g. 8745 = 87.45%)
    prior_average   BIGINT          NOT NULL CHECK (prior_average BETWEEN 0 AND 10000),

    -- LMSR state (all amounts in cents)
    b               BIGINT          NOT NULL CHECK (b > 0),
    shares_higher   BIGINT          NOT NULL DEFAULT 0 CHECK (shares_higher >= 0),
    shares_lower    BIGINT          NOT NULL DEFAULT 0 CHECK (shares_lower  >= 0),

    -- Lifecycle
    status          market_status   NOT NULL DEFAULT 'open',
    outcome         market_outcome,
    closes_at       TIMESTAMPTZ     NOT NULL,
    resolved_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- outcome only set when resolved
    CONSTRAINT markets_outcome_requires_resolved CHECK (
        outcome IS NULL OR status = 'resolved'
    ),
    -- resolved_at only set when resolved
    CONSTRAINT markets_resolved_at_requires_resolved CHECK (
        resolved_at IS NULL OR status = 'resolved'
    ),
    -- closes_at must be before exam_date
    CONSTRAINT markets_closes_before_exam CHECK (
        closes_at::DATE <= exam_date
    ),
    -- resolved markets must have an outcome
    CONSTRAINT markets_resolved_requires_outcome CHECK (
        status <> 'resolved' OR outcome IS NOT NULL
    ),
    -- resolved markets must have a resolved_at
    CONSTRAINT markets_resolved_requires_resolved_at CHECK (
        status <> 'resolved' OR resolved_at IS NOT NULL
    )
);

CREATE INDEX idx_markets_creator    ON markets (creator_id);
CREATE INDEX idx_markets_status     ON markets (status);
CREATE INDEX idx_markets_course     ON markets (course_code);
CREATE INDEX idx_markets_closes_at  ON markets (closes_at) WHERE status = 'open';

CREATE TRIGGER set_markets_updated_at
    BEFORE UPDATE ON markets
    FOR EACH ROW
    EXECUTE FUNCTION trigger_set_updated_at();

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TRIGGER IF EXISTS set_markets_updated_at ON markets;
DROP INDEX IF EXISTS idx_markets_closes_at;
DROP INDEX IF EXISTS idx_markets_course;
DROP INDEX IF EXISTS idx_markets_status;
DROP INDEX IF EXISTS idx_markets_creator;
DROP TABLE IF EXISTS markets;
DROP TYPE IF EXISTS market_outcome;
DROP TYPE IF EXISTS market_status;
-- +goose StatementEnd
