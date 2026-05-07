package refresh

import (
	"context"
	"fmt"
	"go-modules/internal/models"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

type Repo struct {
	coll *mongo.Collection
}

func NewRepo(db *mongo.Database) *Repo {
	return &Repo{
		coll: db.Collection("refresh_tokens"),
	}
}

func (r *Repo) DeleteRefreshToken(ctx context.Context, token string) error {
	_, err := r.coll.DeleteOne(ctx, bson.M{"token": token})
	return err
}

func (r *Repo) ValidateRefreshToken(ctx context.Context, token string) (models.RefreshToken, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	token = strings.TrimSpace(token)
	if token == "" {
		return models.RefreshToken{}, fmt.Errorf("missing refresh token")
	}

	fmt.Printf("LOOKUP TOKEN: %q\n", token)

	filter := bson.M{"token": token}

	var existing models.RefreshToken
	err := r.coll.FindOne(opCtx, filter).Decode(&existing)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return models.RefreshToken{}, fmt.Errorf("invalid refresh token")
		}
		return models.RefreshToken{}, err
	}

	if time.Now().UTC().After(existing.ExpiresAt) {
		_, err := r.coll.DeleteOne(opCtx, filter)
		if err != nil {
			return models.RefreshToken{}, fmt.Errorf("failed to delete expired refresh token")
		}
		return models.RefreshToken{}, fmt.Errorf("refresh token expired")
	}

	return existing, nil
}

func (r *Repo) SaveRefreshToken(ctx context.Context, token models.RefreshToken) (string, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	res, err := r.coll.InsertOne(opCtx, token)

	if err != nil {
		return "", err
	}

	id, ok := res.InsertedID.(bson.ObjectID)
	if !ok {
		return "", fmt.Errorf("unexpected ID type: %T", res.InsertedID)
	}

	token.ID = id

	return token.Token, nil

}

func (r *Repo) GetUserIDByRefreshToken(ctx context.Context, token string) (string, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	filter := bson.M{"token": token}

	var existing models.RefreshToken
	err := r.coll.FindOne(opCtx, filter).Decode(&existing)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return "", fmt.Errorf("invalid refresh token cant get user id")
		}
		return "", err
	}

	return existing.UserID.Hex(), nil
}

func (r *Repo) GetUserByID(ctx context.Context, userID string) (models.User, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	id, err := bson.ObjectIDFromHex(userID)
	if err != nil {
		return models.User{}, fmt.Errorf("invalid user id")
	}

	filter := bson.M{"_id": id}

	var user models.User

	er := r.coll.Database().Collection("myuser").FindOne(opCtx, filter).Decode(&user)
	if er != nil {
		return models.User{}, er
	}

	return user, nil
}
