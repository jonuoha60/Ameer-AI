package main

import (
	"fmt"
	"go-modules/internal/config"
	"go-modules/internal/db"
	"go-modules/internal/server"
	"log"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Config error: %v", err)
	}

	mongoClient, database, err := db.Connect(cfg)
	if err != nil {
		log.Fatalf("db error: %v", err)
	}

	defer func() {
		if err := db.Disconnect(mongoClient); err != nil {
			log.Printf("mongo disconnect error: %v", err)
		}
	}()

	router := server.NewRouter(database, cfg)

	addr := fmt.Sprintf(":%s", cfg.ServerPort)

	if err := router.Run(addr); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
