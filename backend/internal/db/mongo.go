package db

import (
	"context"
	"fmt"
	"go-modules/internal/config"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

func Connect(cfg config.Config) (*mongo.Client, *mongo.Database, error) {

	clientOpts := options.Client().ApplyURI(cfg.MongoURI).SetTimeout(10 * time.Second)

	client, err := mongo.Connect(clientOpts)

	if err != nil {
		return nil, nil, fmt.Errorf("mongo connect fail")
	}

	pingCtx, cancel := context.WithTimeout(context.Background(), 2*time.Second)

	defer cancel()

	if err := client.Ping(pingCtx, nil); err != nil {
		return nil, nil, fmt.Errorf("mongo ping fail")
	}

	databse := client.Database(cfg.MongoDB)

	return client, databse, nil
}

func Disconnect(client *mongo.Client) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	return client.Disconnect(ctx)
}
