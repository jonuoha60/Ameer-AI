package experience

import (
	"fmt"
	"context"
	"go-modules/internal/models"
	"time"
	"go.mongodb.org/mongo-driver/v2/bson"


)

type Service struct {
	repo       *Repo

}

func NewService(repo *Repo) *Service {
	return &Service{repo: repo}
}

func (s *Service) CreateExperience(
	ctx context.Context,
	req models.Experience,
) (models.Experience, error) {

	now := time.Now().UTC()

	experience := models.Experience{
		UserID:    req.UserID,

		From:      req.From,
		To:        req.To,

		Title:     req.Title,
		Review:    req.Review,
		Rating:    req.Rating,

		Image:    req.Image,

		Transport: req.Transport,
		Budget:    req.Budget,

		CreatedAt: now,
	}

	return s.repo.Create(ctx, experience)
}

func (s *Service) GetExperience(
	ctx context.Context,
	userID string,
) ([]models.Experience, error) {

	id, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user id: %w", err)
	}

	experience, err := s.repo.GetExperienceByUserID(ctx, id)
	if err != nil {
		return nil, err
	}

	return experience, nil
}