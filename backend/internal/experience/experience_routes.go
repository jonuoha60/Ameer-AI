package experience

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go-modules/internal/middleware"

)

func RegisterRoutes(r *gin.Engine, db *mongo.Database, jwtAccess string) {
	service := NewService(NewRepo(db))
	h := NewHandler(service)
	experienceGroup := r.Group("/experience")
	experienceGroup.Use(middleware.AuthMiddleware(jwtAccess))
	{
		experienceGroup.POST("/create", h.CreateUserExperience)
		experienceGroup.GET("/get", h.GetUserExperience)
	}

}
