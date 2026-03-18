package api

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/AlexanderWangY/gatormarket/backend/internal/db/sqlc"
	"github.com/AlexanderWangY/gatormarket/backend/internal/middleware"
	"github.com/AlexanderWangY/gatormarket/backend/internal/service"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgtype"
)

type MarketHandler struct {
	markets *service.MarketService
}

func NewMarketHandler(markets *service.MarketService) *MarketHandler {
	return &MarketHandler{markets: markets}
}

type createMarketRequest struct {
	Title        string `json:"title"`
	CourseCode   string `json:"course_code"`
	ExamName     string `json:"exam_name"`
	ExamDate     string `json:"exam_date"`
	PriorAverage int64  `json:"prior_average"`
	B            int64  `json:"b"`
	ClosesAt     string `json:"closes_at"`
}

func (h *MarketHandler) HandleCreate(w http.ResponseWriter, r *http.Request) {
	var req createMarketRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid request body"})
		return
	}

	claims := middleware.GetClaims(r)
	if claims == nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "unauthorized"})
		return
	}

	creatorID, err := uuid.Parse(claims.Subject)
	if err != nil {
		writeJSON(w, http.StatusUnauthorized, map[string]string{"error": "invalid user id in token"})
		return
	}

	examDate, err := time.Parse("2006-01-02", req.ExamDate)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid exam_date format, expected YYYY-MM-DD"})
		return
	}

	closesAt, err := time.Parse(time.RFC3339, req.ClosesAt)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid closes_at format, expected RFC3339"})
		return
	}

	params := sqlc.CreateMarketParams{
		CreatorID:    creatorID,
		Title:        req.Title,
		CourseCode:   req.CourseCode,
		ExamName:     req.ExamName,
		ExamDate:     pgtype.Date{Time: examDate, Valid: true},
		PriorAverage: req.PriorAverage,
		B:            req.B,
		ClosesAt:     pgtype.Timestamptz{Time: closesAt, Valid: true},
	}

	market, err := h.markets.Create(r.Context(), params)
	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to create market"})
		return
	}

	writeJSON(w, http.StatusCreated, market)
}

func (h *MarketHandler) HandleGetByID(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid market id"})
		return
	}

	market, err := h.markets.GetByID(r.Context(), id)
	if err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "market not found"})
			return
		}
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to get market"})
		return
	}

	writeJSON(w, http.StatusOK, market)
}

func (h *MarketHandler) HandleList(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()
	status := q.Get("status")
	course := q.Get("course")
	creator := q.Get("creator")

	var (
		markets []sqlc.Market
		err     error
	)

	switch {
	case status == "open":
		markets, err = h.markets.ListOpen(r.Context())
	case status != "":
		markets, err = h.markets.ListByStatus(r.Context(), sqlc.MarketStatus(status))
	case course != "":
		markets, err = h.markets.ListByCourse(r.Context(), course)
	case creator != "":
		creatorID, parseErr := uuid.Parse(creator)
		if parseErr != nil {
			writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid creator id"})
			return
		}
		markets, err = h.markets.ListByCreator(r.Context(), creatorID)
	default:
		markets, err = h.markets.List(r.Context())
	}

	if err != nil {
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to list markets"})
		return
	}

	writeJSON(w, http.StatusOK, markets)
}

func (h *MarketHandler) HandleDelete(w http.ResponseWriter, r *http.Request) {
	idStr := r.PathValue("id")
	id, err := uuid.Parse(idStr)
	if err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]string{"error": "invalid market id"})
		return
	}

	if err := h.markets.Delete(r.Context(), id); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			writeJSON(w, http.StatusNotFound, map[string]string{"error": "market not found"})
			return
		}
		writeJSON(w, http.StatusInternalServerError, map[string]string{"error": "failed to delete market"})
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
