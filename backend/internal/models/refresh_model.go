package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type RefreshToken struct {
	ID        bson.ObjectID `bson:"_id,omitempty"  json:"id,omitempty"`
	UserID    bson.ObjectID `bson:"user_id"        json:"user_id"`
	Token     string        `bson:"token"          json:"token"`
	Role      string        `bson:"role"           json:"role"`
	ExpiresAt time.Time     `bson:"expires_at"     json:"expires_at"`
	CreatedAt time.Time     `bson:"created_at"     json:"created_at"`
}
