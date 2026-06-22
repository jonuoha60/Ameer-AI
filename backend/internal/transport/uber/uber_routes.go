package uber

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func RegisterRoutes(r *gin.Engine, db *mongo.Database) {
	s := NewService()
	h := NewHandler(s)

	transportGroup := r.Group("/transport")
	{
		transportGroup.POST("/uber", h.HandleUber)
	}
}
