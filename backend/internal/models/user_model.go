package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type User struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	Username  string        `bson:"username" json:"username"`
	Email     string        `bson:"email" json:"email"`
	Role      string        `bson:"role" json:"role"`
	Password  string        `bson:"password" json:"-"`
	CreatedAt time.Time     `bson:"created_at" json:"created_at"`
}

type CreateUserRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}
