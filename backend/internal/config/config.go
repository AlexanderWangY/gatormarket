package config

import "github.com/caarlos0/env/v11"

type Config struct {
	DatabaseURL string `env:"DATABASE_URL,required"`
	Port        int    `env:"PORT"          envDefault:"8080"`
	JWTSecret   string `env:"JWT_SECRET,required"`
	BaseURL     string `env:"BASE_URL"      envDefault:"http://localhost:8080"`

	// Email
	ResendAPIKey string `env:"RESEND_API_KEY"`
}

func Load() (*Config, error) {
	cfg := &Config{}
	if err := env.Parse(cfg); err != nil {
		return nil, err
	}
	return cfg, nil
}
