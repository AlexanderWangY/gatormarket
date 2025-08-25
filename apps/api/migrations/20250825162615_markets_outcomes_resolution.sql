-- +goose Up
-- +goose StatementBegin
ALTER TABLE markets
ADD COLUMN resolved_outcome_id UUID REFERENCES outcomes(id) ON DELETE SET NULL DEFERRABLE INITIALLY DEFERRED;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE markets
DROP COLUMN IF EXISTS resolved_outcome_id;
-- +goose StatementEnd
