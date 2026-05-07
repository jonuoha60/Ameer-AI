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

	token, err := auth.ValidateToken(oldToken, s.jwtRefresh)
	if err != nil {
		return RefreshResponse{}, fmt.Errorf("invalid token signature")
	}

	claims, ok := token.Claims.(*auth.Claims)
	if !ok || !token.Valid {
		return RefreshResponse{}, fmt.Errorf("invalid token claims")
	}

	existingToken, err := s.repo.ValidateRefreshToken(ctx, oldToken)
	if err != nil {
		return RefreshResponse{}, err
	}

	role := claims.Role
	userID := claims.Subject

	newAccess, newRefresh, err := auth.CreateTokenPair(
		s.jwtRefresh,
		s.jwtAccess,
		userID,
		role,
	)
	if err != nil {
		return RefreshResponse{}, err
	}

	err = s.repo.DeleteRefreshToken(ctx, oldToken)
	if err != nil {
		return RefreshResponse{}, fmt.Errorf("failed to rotate token")
	}

	user, err := s.repo.GetUserByID(ctx, userID)
	if err != nil {
		return RefreshResponse{}, fmt.Errorf("failed to retrieve user information")
	}

	_, err = s.repo.SaveRefreshToken(ctx, models.RefreshToken{
		UserID:    existingToken.UserID,
		Token:     newRefresh,
		Role:      role,
		ExpiresAt: time.Now().Add(7 * 24 * time.Hour),
		CreatedAt: time.Now(),
	})

	if err != nil {
		return RefreshResponse{}, err
	}

	return RefreshResponse{
		AccessToken:  newAccess,
		RefreshToken: newRefresh,

		User: &user,
	}, nil
}
