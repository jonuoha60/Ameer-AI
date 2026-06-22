package trips

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
		coll: db.Collection("trips"),
	}
}

func (r *Repo) Create(ctx context.Context, trip models.Trip) (models.Trip, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	
	res, err := r.coll.InsertOne(opCtx, trip)
	if err != nil {
		return models.Trip{}, fmt.Errorf("save trip failed: %w", err)
	}

	id, ok := res.InsertedID.(bson.ObjectID)
	if !ok {
		return models.Trip{}, fmt.Errorf("unexpected ID type: %T", res.InsertedID)
	}

	trip.ID = id

	return trip, nil
}

func (r *Repo) GetTripsByUserID(
	ctx context.Context,
	userID bson.ObjectID,
) ([]models.Trip, error) {

	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	filter := bson.M{
		"user_id": userID,
	}

	cursor, err := r.coll.Find(opCtx, filter)
	if err != nil {
		return nil, fmt.Errorf("failed to get trips: %w", err)
	}
	defer cursor.Close(opCtx)

	var trips []models.Trip

	if err := cursor.All(opCtx, &trips); err != nil {
		return nil, fmt.Errorf("failed to decode trips: %w", err)
	}

	return trips, nil
}