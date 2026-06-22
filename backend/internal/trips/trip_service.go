package trips

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

func (s *Service) CreateTrip(
	ctx context.Context,
	req models.Trip,
	userID string,
) (models.Trip, error) {

	now := time.Now().UTC()

	id, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return models.Trip{}, fmt.Errorf("invalid user id: %w", err)
	}

	trip := models.Trip{
		UserID:    id,
		From:      req.From,
		To:        req.To,
		Budget:    req.Budget,
		Distance:  req.Distance,
		Duration:  req.Duration,
		CreatedAt: now,
	}

	return s.repo.Create(ctx, trip)
}
func (s *Service) GetTrips(
	ctx context.Context,
	userID string,
) ([]models.Trip, error) {

	id, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return nil, fmt.Errorf("invalid user id: %w", err)
	}

	trips, err := s.repo.GetTripsByUserID(ctx, id)
	if err != nil {
		return nil, err
	}

	return trips, nil
}