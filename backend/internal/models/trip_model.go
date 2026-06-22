package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Trip struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    bson.ObjectID `bson:"user_id" json:"user_id"`

	From      string  `bson:"from" json:"from"`
	To        string  `bson:"to" json:"to"`
	Budget    float64 `bson:"budget" json:"budget"`

	Distance  string `bson:"distance" json:"distance"`
	Duration  string `bson:"duration" json:"duration"`

	CreatedAt time.Time `bson:"created_at" json:"created_at"`
}