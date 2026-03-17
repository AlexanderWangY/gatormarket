-- name: CreateMarket :one
INSERT INTO markets (
    creator_id, title, course_code, exam_name, exam_date,
    prior_average, b, closes_at
)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
RETURNING *;

-- name: GetMarketByID :one
SELECT * FROM markets
WHERE id = $1;

-- name: ListMarkets :many
SELECT * FROM markets
ORDER BY created_at DESC;

-- name: ListMarketsByStatus :many
SELECT * FROM markets
WHERE status = $1
ORDER BY created_at DESC;

-- name: ListMarketsByCourse :many
SELECT * FROM markets
WHERE course_code = $1
ORDER BY closes_at ASC;

-- name: ListMarketsByCreator :many
SELECT * FROM markets
WHERE creator_id = $1
ORDER BY created_at DESC;

-- name: ListOpenMarkets :many
SELECT * FROM markets
WHERE status = 'open'
  AND closes_at > NOW()
ORDER BY closes_at ASC;

-- name: UpdateMarketShares :one
UPDATE markets
SET shares_higher = $2,
    shares_lower  = $3
WHERE id = $1
RETURNING *;

-- name: UpdateMarketStatus :one
UPDATE markets
SET status = $2
WHERE id = $1
RETURNING *;

-- name: ResolveMarket :one
UPDATE markets
SET status  = 'resolved',
    outcome = $2
WHERE id = $1
RETURNING *;

-- name: DeleteMarket :exec
DELETE FROM markets
WHERE id = $1;
