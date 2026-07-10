package experience

import (
	"go-modules/internal/middleware"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func RegisterRoutes(r *gin.Engine, db *mongo.Database, jwtAccess string) {
	service := NewService(NewRepo(db))
	h := NewHandler(service)

	experienceGroup := r.Group("/experience")

	// Public routes
	experienceGroup.GET("/discover", h.GetExperiences)

	// Protected routes
	auth := experienceGroup.Group("/")
	auth.Use(middleware.AuthMiddleware(jwtAccess))
	{
		auth.POST("/create", h.CreateUserExperience)
		auth.GET("/get", h.GetUserExperience)
	}
}
