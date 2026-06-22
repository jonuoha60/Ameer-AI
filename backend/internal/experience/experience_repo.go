package experience

import (
	"context"
	"fmt"
	"time"

	"go-modules/internal/models"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)


type Repo struct {
	coll *mongo.Collection
}

func NewRepo(db *mongo.Database) *Repo {
	return &Repo{
		coll: db.Collection("experience"),
	}
}

func (r *Repo) Create(ctx context.Context, experience models.Experience) (models.Experience, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	
	res, err := r.coll.InsertOne(opCtx, experience)
	if err != nil {
		return models.Experience{}, fmt.Errorf("save experience failed: %w", err)
	}

	id, ok := res.InsertedID.(bson.ObjectID)
	if !ok {
		return models.Experience{}, fmt.Errorf("unexpected ID type: %T", res.InsertedID)
	}

	experience.ID = id

	return experience, nil
}

func (r *Repo) GetExperienceByUserID(
	ctx context.Context,
	userID bson.ObjectID,
) ([]models.Experience, error) {

	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	filter := bson.M{
		"user_id": userID,
	}

	cursor, err := r.coll.Find(opCtx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to get experience: %w", err)
	}
	defer cursor.Close(opCtx)

	var experience []models.Experience

	if err := cursor.All(opCtx, &experience); err != nil {
		return nil, fmt.Errorf("failed to decode experience: %w", err)
	}

	return experience, nil
}