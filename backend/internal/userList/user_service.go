package userList

import (
	"context"
	"go-modules/internal/auth"
	"go-modules/internal/models"
	"go-modules/internal/refresh"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
)

type Service struct {
	repo       *Repo
	tokenRepo  *refresh.Repo
	jwtRefresh string
	jwtAccess  string
}

type AuthResponse struct {
	User         models.User `json:"user"`
	RefreshToken string      `json:"refresh_token"`
	AccessToken  string      `json:"access_token,omitempty"`
}

func NewService(repo *Repo, jwtRefresh, jwtAccess string, db *mongo.Database) *Service {
	return &Service{repo: repo, tokenRepo: refresh.NewRepo(db), jwtRefresh: jwtRefresh, jwtAccess: jwtAccess}
}

func (s *Service) Register(ctx context.Context, req models.User) (AuthResponse, error) {
	now := time.Now().UTC()

	user := models.User{
		Username:  req.Username,
		Email:     req.Email,
		Password:  req.Password,
		Role:      "user",
		CreatedAt: now,
	}

	created, err := s.repo.Create(ctx, user)
	if err != nil {
		return AuthResponse{}, err
	}

	accessToken, rt, err := auth.CreateTokenPair(s.jwtRefresh, s.jwtAccess, created.ID.Hex(), created.Role)
	if err != nil {
		return AuthResponse{}, err
	}

	refreshToken := models.RefreshToken{
		UserID:    created.ID,
		Token:     rt,
		ExpiresAt: now.Add(7 * 24 * time.Hour),
		CreatedAt: now,
	}

	if _, err := s.tokenRepo.SaveRefreshToken(ctx, refreshToken); err != nil {
		return AuthResponse{}, err
	}

	return AuthResponse{
		User:        created,
		AccessToken: accessToken,
	}, nil
}

func (s *Service) Login(ctx context.Context, email, password string) (AuthResponse, error) {
	user, err := s.repo.GetUser(ctx, email, password)
	if err != nil {
		return AuthResponse{}, err
	}

	accessToken, rt, err := auth.CreateTokenPair(s.jwtRefresh, s.jwtAccess, user.ID.Hex(), user.Role)
	if err != nil {
		return AuthResponse{}, err
	}

	now := time.Now().UTC()

	cookiesRefreshToken := models.RefreshToken{
		UserID:    user.ID,
		Token:     rt,
		ExpiresAt: now.Add(7 * 24 * time.Hour),
		CreatedAt: now,
	}

	if _, err := s.tokenRepo.SaveRefreshToken(ctx, cookiesRefreshToken); err != nil {
		return AuthResponse{}, err
	}

	return AuthResponse{
		User:         user,
		RefreshToken: rt,
		AccessToken:  accessToken,
	}, nil
}
