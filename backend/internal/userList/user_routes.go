package userList

import (
	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func RegisterRoutes(r *gin.Engine, db *mongo.Database, jwtRefresh string, jwtAccess string, fireBaseCred string) {
	service := NewService(NewRepo(db), jwtRefresh, jwtAccess, db, fireBaseCred)
	h := NewHandler(service)

	userGroup := r.Group("/user")
	{
		userGroup.POST("/google/login", h.GoogleCreateUser)
		userGroup.POST("/signup", h.CreateUser)
		userGroup.POST("/login", h.GetUser)
	}
}
