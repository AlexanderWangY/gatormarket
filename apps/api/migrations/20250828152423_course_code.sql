-- +goose Up
-- +goose StatementBegin
ALTER TABLE markets
ADD COLUMN course_code TEXT NOT NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin

ALTER TABLE markets
DROP COLUMN course_code;
-- +goose StatementEnd
