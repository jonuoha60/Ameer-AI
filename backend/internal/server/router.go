package server

import (
	"go-modules/internal/assistant"
	"go-modules/internal/config"
	"go-modules/internal/maps"
	"go-modules/internal/refresh"
	"go-modules/internal/transport/routes"
	"go-modules/internal/userList"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func NewRouter(database *mongo.Database, cfg config.Config) *gin.Engine {
	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	// r.GET("/health", func(ctx *gin.Context) {
	// 	ctx.JSON(http.StatusOK, gin.H{
	// 		"ok":     true,
	// 		"status": "healthy",
	// 	})
	// })

	for _, r := range r.Routes() {
		println(r.Method, r.Path)
	}

	userList.RegisterRoutes(r, database, cfg.JWTRefresh, cfg.JWTAccess)
	maps.RegisterRoutes(r, cfg.GoogleMap)
	routes.RegisterRoutes(r, cfg.GoogleMap)
	assistant.RegisterRoutes(r, cfg.Gemini)
	refresh.RegisterRoutes(r, database, cfg.JWTRefresh, cfg.JWTAccess)

	return r
}
