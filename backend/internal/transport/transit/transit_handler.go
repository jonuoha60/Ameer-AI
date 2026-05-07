package transit

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{Service: service}
}

func (h *Handler) HandleTransit(c *gin.Context) {

	var req Transit

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// if req.OriginLat == 0 || req.OriginLng == 0 ||
	// 	req.DestLat == 0 || req.DestLng == 0 {

	// 	c.JSON(http.StatusBadRequest, gin.H{
	// 		"error": "invalid coordinates",
	// 	})
	// 	return
	// }

	result, err := h.Service.TransitPricing(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, result)
}
