# ---- Dev stage ----
FROM golang:1.26-alpine AS dev

WORKDIR /app

RUN go install github.com/air-verse/air@latest

COPY go.mod go.sum* ./
RUN go mod download

# Source is bind-mounted in docker-compose for hot reload
CMD ["air", "-c", ".air.toml"]


# ---- Build stage ----
FROM golang:1.26-alpine AS builder

WORKDIR /app

COPY go.mod go.sum* ./
RUN go mod download

COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app/bin/server ./cmd/server/main.go


# ---- Prod stage ----
FROM alpine:3.21 AS prod

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=builder /app/bin/server .

EXPOSE 8080

CMD ["./server"]
