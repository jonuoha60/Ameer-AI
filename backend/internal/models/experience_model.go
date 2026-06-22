package models

import (
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type Experience struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID    bson.ObjectID `bson:"user_id" json:"user_id"`


	From string `bson:"from" json:"from"`
	To   string `bson:"to" json:"to"`

	Title   string `bson:"title" json:"title"`
	Review  string `bson:"review" json:"review"`
	Rating  int    `bson:"rating" json:"rating"` 

	Image 	string `bson:"image" json:"image"`

	Transport string  `bson:"transport" json:"transport"`
	Budget    float64 `bson:"budget" json:"budget"`

	Likes    int `bson:"likes" json:"likes"`
	Comments int `bson:"comments" json:"comments"`

	CreatedAt time.Time `bson:"created_at" json:"created_at"`
}