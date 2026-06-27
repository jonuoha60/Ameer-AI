package refresh

import (
	"context"
	"fmt"
	"go-modules/internal/auth"
	"go-modules/internal/models"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

type Service struct {
	repo       *Repo
	jwtRefresh string
	jwtAccess  string
}

func NewService(repo *Repo, jwtRefresh, jwtAccess string, db *mongo.Database) *Service {
	return &Service{repo: repo, jwtRefresh: jwtRefresh, jwtAccess: jwtAccess}
}

type RefreshResponse struct {
	AccessToken  string `json:"access_token,omitempty"`
	RefreshToken string `json:"refresh_token,omitempty"`

	User *models.User `json:"user,omitempty"`
}

func (s *Service) Create(ctx context.Context, oldToken string) (RefreshResponse, error) {

	existingToken, err := s.repo.ValidateRefreshToken(ctx, oldToken)
	if err != nil {
		return RefreshResponse{}, err
	}

	userID := existingToken.UserID.Hex()
	role := existingToken.Role

	newAccess, newRefresh, err := auth.CreateTokenPair(
		s.jwtRefresh,
		s.jwtAccess,
		userID,
		role,
	)
	if err != nil {
		return RefreshResponse{}, fmt.Errorf("failed to create token pair: %w", err)
	}

	err = s.repo.RotateRefreshToken(ctx, oldToken, models.RefreshToken{
		UserID:    existingToken.UserID,
		Token:     newRefresh,
		Role:      role,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
		CreatedAt: time.Now(),
	})

	if err != nil {
		return RefreshResponse{}, fmt.Errorf("refresh token rotation failed: %w", err)
	}

	// ---------------------------------------------------
	// 4. FETCH USER
	// ---------------------------------------------------
	user, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return RefreshResponse{}, fmt.Errorf("failed to fetch user: %w", err)
	}

	// ---------------------------------------------------
	// 5. RETURN CLEAN RESPONSE
	// ---------------------------------------------------
	return RefreshResponse{
		AccessToken:  newAccess,
		RefreshToken: newRefresh,
		User:         &user,
	}, nil
}
