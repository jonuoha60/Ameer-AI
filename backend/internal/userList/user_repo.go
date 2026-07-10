package userList

import (
	"context"
	"errors"
	"fmt"
	"go-modules/internal/firebase"
	"go-modules/internal/models"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

type Repo struct {
	coll *mongo.Collection
}

func NewRepo(db *mongo.Database) *Repo {
	return &Repo{
		coll: db.Collection("myuser"),
	}
}

func (r *Repo) GoogleCreate(ctx context.Context, idToken string, fireBaseCred string) (models.User, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	app, err := firebase.InitFirebase(fireBaseCred)
	if err != nil {
		return models.User{}, fmt.Errorf("error initializing app: %v", err)
	}

	client, err := app.Auth(ctx)
	if err != nil {
		return models.User{}, fmt.Errorf("error getting Auth client: %v", err)
	}

	decodedToken, err := client.VerifyIDToken(ctx, idToken)
	if err != nil {
		return models.User{}, fmt.Errorf("error verifying ID token: %v", err)
	}

	uid := decodedToken.UID

	email, _ := decodedToken.Claims["email"].(string)
	email = strings.ToLower(strings.TrimSpace(email))

	name, _ := decodedToken.Claims["name"].(string)
	photo, _ := decodedToken.Claims["picture"].(string)

	var existing models.User
	err = r.coll.FindOne(opCtx, bson.M{"firebase_uid": uid}).Decode(&existing)
	if err == nil {
		return existing, nil // user already exists → return it
	}

	if err != mongo.ErrNoDocuments {
		return models.User{}, fmt.Errorf("error checking existing user: %w", err)
	}

	newUser := models.User{
		FirebaseUID: uid,
		Email:       email,
		Username:    name,
		PhotoURL:    photo,
		CreatedAt:   time.Now(),
		Provider:    "google",
	}

	res, err := r.coll.InsertOne(opCtx, newUser)
	if err != nil {
		return models.User{}, fmt.Errorf("create user failed: %w", err)
	}

	id, ok := res.InsertedID.(bson.ObjectID)
	if !ok {
		return models.User{}, fmt.Errorf("unexpected ID type: %T", res.InsertedID)
	}

	newUser.ID = id

	return newUser, nil
}

func (r *Repo) Create(ctx context.Context, user models.User) (models.User, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

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

	bytes, err := bcrypt.GenerateFromPassword([]byte(user.Password), 14)

	if err != nil {
		return models.User{}, fmt.Errorf("hash password failed: %w", err)
	}

	user.Password = string(bytes)

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

func (r *Repo) GetUserID(ctx context.Context, userID bson.ObjectID) (models.User, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	filter := bson.M{"_id": userID}

	var user models.User
	if err := r.coll.FindOne(opCtx, filter).Decode(&user); err != nil {
		if errors.Is(err, mongo.ErrNoDocuments) {
			return models.User{}, fmt.Errorf("user not found: %w", err)
		}
		return models.User{}, fmt.Errorf("failed to get user: %w", err)
	}

	return user, nil
}

func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
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

	if !CheckPasswordHash(password, user.Password) {
		return models.User{}, fmt.Errorf("invalid email or password")
	}

	return user, nil
}

func (r *Repo) CreateFollowing(ctx context.Context, userID bson.ObjectID, followingID bson.ObjectID) (models.User, error) {
	opCtx, cancel := context.WithTimeout(ctx, 5*time.Second)
	defer cancel()

	opts := options.FindOneAndUpdate().SetReturnDocument(options.After)

	var user models.User
	err := r.coll.FindOneAndUpdate(
		opCtx,
		bson.M{"_id": userID},
		bson.M{"$addToSet": bson.M{"following": followingID}},
		opts,
	).Decode(&user)
	if err != nil {
		return models.User{}, fmt.Errorf("failed to update following list: %w", err)
	}

	_, err = r.coll.UpdateOne(
		opCtx,
		bson.M{"_id": followingID},
		bson.M{"$addToSet": bson.M{"followers": userID}},
	)
	if err != nil {
		return models.User{}, fmt.Errorf("failed to update followers list: %w", err)
	}

	return user, nil
}
