package trips

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go-modules/internal/middleware"

)

func RegisterRoutes(r *gin.Engine, db *mongo.Database, jwtAccess string) {
	service := NewService(NewRepo(db))
	h := NewHandler(service)
	tripGroup := r.Group("/trips")
	tripGroup.Use(middleware.AuthMiddleware(jwtAccess))
	{
		tripGroup.POST("/create", h.CreateTrips)
		tripGroup.GET("/get", h.GetUserTrips)
	}

}
