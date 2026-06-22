package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type RefreshToken struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	UserID    bson.ObjectID `bson:"user_id"`
	Token     string        `bson:"token"`
	Role      string        `bson:"role"`
	ExpiresAt time.Time     `bson:"expires_at"`
	CreatedAt time.Time     `bson:"created_at"`
}

type CreateRefreshTokenRequest struct {
	UserID bson.ObjectID `json:"user_id" binding:"required"`
}
