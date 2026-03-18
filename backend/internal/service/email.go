package service

import (
	"fmt"

	"github.com/resend/resend-go/v2"
)

type EmailService struct {
	client *resend.Client
	from   string
}

func NewEmailService(apiKey, from string) *EmailService {
	return &EmailService{
		client: resend.NewClient(apiKey),
		from:   from,
	}
}

func (s *EmailService) SendVerification(to, token, baseURL string) error {
	link := fmt.Sprintf("%s/api/auth/verify?token=%s", baseURL, token)
	_, err := s.client.Emails.Send(&resend.SendEmailRequest{
		From:    s.from,
		To:      []string{to},
		Subject: "Verify your GatorMarket account",
		Html:    `<p>Thanks for signing up. Click <a href="` + link + `">here</a> to verify your GatorMarket account.</p>`,
	})
	if err != nil {
		return fmt.Errorf("send verification email: %w", err)
	}
	return nil
}
