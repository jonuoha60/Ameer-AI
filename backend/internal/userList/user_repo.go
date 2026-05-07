package userList

import (
	"context"
	"fmt"
	"go-modules/internal/models"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

// Repo -> data access layer (where we talk to the DB)

type Repo struct {
	coll *mongo.Collection
}

func NewRepo(db *mongo.Database) *Repo {
	return &Repo{
		coll: db.Collection("myuser"),
	}
}

func (r *Repo) Create(ctx context.Context, user models.User) (models.User, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	// FIX: normalize on the struct itself, not just the filter map,
	// so the stored document has the canonical form that login queries against.
	user.Email = strings.ToLower(strings.TrimSpace(user.Email))
	user.Username = strings.ToLower(strings.TrimSpace(user.Username))

	filterMail := bson.M{"email": user.Email}
	filterUsername := bson.M{"username": user.Username}

	var existing models.User

	err := r.coll.FindOne(opCtx, filterMail).Decode(&existing)
	if err == nil {
		return models.User{}, fmt.Errorf("user with email %s already exists", user.Email)
	}

	err2 := r.coll.FindOne(opCtx, filterUsername).Decode(&existing)
	if err2 == nil {
		return models.User{}, fmt.Errorf("user with username %s already exists", user.Username)
	}

	res, err := r.coll.InsertOne(opCtx, user)
	if err != nil {
		return models.User{}, fmt.Errorf("create user failed: %w", err)
	}

	id, ok := res.InsertedID.(bson.ObjectID)
	if !ok {
		return models.User{}, fmt.Errorf("unexpected ID type: %T", res.InsertedID)
	}

	user.ID = id

	return user, nil
}

func (r *Repo) GetUser(ctx context.Context, email, password string) (models.User, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	email = strings.ToLower(strings.TrimSpace(email))

	filter := bson.M{"email": email}

	var user models.User

	err := r.coll.FindOne(opCtx, filter).Decode(&user)
	if err != nil {
		return models.User{}, fmt.Errorf("user does not exist: %w", err)
	}

	return user, nil
}
