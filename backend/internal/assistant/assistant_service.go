package assistant

import (
	"context"
	"fmt"
	"go-modules/internal/models"
	"net/http"
	"time"

	"google.golang.org/genai"
)

type Service struct {
	APIKey string
	Client *http.Client
}

func NewService(apiKey string) *Service {
	return &Service{
		APIKey: apiKey,
		Client: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (s *Service) GeminiAssitant(ast models.Assistant) (models.AssistantResult, error) {
	ctx := context.Background()

	genaiClient, err := genai.NewClient(ctx, &genai.ClientConfig{
		APIKey: s.APIKey,
	})

	if err != nil {
		return models.AssistantResult{}, err
	}

	result, err := genaiClient.Models.GenerateContent(
		ctx,
		"gemini-3-flash-preview",
		genai.Text(ast.Message),
		nil,
	)

	if err != nil {
		return models.AssistantResult{}, err
	}
	fmt.Println(result.Text())

	return models.AssistantResult{
		Response: result.Text(),
	}, nil

}
