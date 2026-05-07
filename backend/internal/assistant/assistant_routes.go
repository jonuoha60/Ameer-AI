package assistant

import (
	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine, apiKey string) {

	s := NewService(apiKey)
	h := NewHandler(s)
	assistantGroup := r.Group("/assistant")

	{
		assistantGroup.POST("", h.HandleAssistant)
	}
}
