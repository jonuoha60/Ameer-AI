package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	ID bson.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`

	Username    string    `bson:"username,omitempty" json:"username,omitempty"`
	Email       string    `bson:"email" json:"email"`
	Bio         string    `bson:"bio" json:"bio"`
	PhotoURL    string    `bson:"photo_url,omitempty" json:"photo_url,omitempty"`
	FirebaseUID string    `bson:"firebase_uid" json:"firebase_uid"`
	Provider    string    `bson:"provider" json:"provider"`
	Password    string    `bson:"password" json:"password"`
	Role        string    `bson:"role" json:"role"`
	CreatedAt   time.Time `bson:"created_at" json:"created_at"`
}

type CreateUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type GoogleAuthRequest struct {
	Token string `json:"token"`
}
