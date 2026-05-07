package maps

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, apiKey string) {

	s := NewService(apiKey)
	h := NewHandler(s)
	mapGroup := r.Group("/location")

	{
		mapGroup.POST("", h.HandleGeoLocation)
		mapGroup.POST("/place", h.HandlePlaceLocation)
		mapGroup.POST("/distance", h.HandleDistance)
	}
}
