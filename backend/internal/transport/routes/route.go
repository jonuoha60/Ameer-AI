package routes

import (
	"go-modules/internal/transport/transit"
	"go-modules/internal/transport/uber"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, apiKey string) {
	uberService := uber.NewService()
	h := uber.NewHandler(uberService)
	transitService := transit.NewService(apiKey)
	h2 := transit.NewHandler(transitService)
	transportGroup := r.Group("/transport")

	{
		transportGroup.POST("/uber", h.HandleUber)
		transportGroup.POST("/transit", h2.HandleTransit)
	}

}
