package userList

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func RegisterRoutes(r *gin.Engine, db *mongo.Database, jwtRefresh, jwtAccess string) {
	service := NewService(NewRepo(db), jwtRefresh, jwtAccess, db)
	h := NewHandler(service)

	userGroup := r.Group("/user")
	{
		userGroup.POST("/signup", h.CreateUser)
		userGroup.POST("/login", h.GetUser)
	}
}
