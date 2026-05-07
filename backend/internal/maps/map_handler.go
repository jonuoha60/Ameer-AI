package maps

import (
	"go-modules/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{Service: service}
}

func (h *Handler) HandleGeoLocation(c *gin.Context) {
	var req models.Location

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid JSON format",
		})
		return
	}

	if req.Latitude < -90 || req.Latitude > 90 ||
		req.Longitude < -180 || req.Longitude > 180 {

		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid coordinates",
		})
		return
	}

	address, err := h.Service.ReverseGeocode(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get location",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"address": address,
	})
}

func (h *Handler) HandlePlaceLocation(c *gin.Context) {
	var req models.Place

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid Json format",
		})

		return

	}

	res, err := h.Service.GetLongLat(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get lng and lat",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"results": res,
	})

}

func (h *Handler) HandleDistance(c *gin.Context) {
	var req models.Distance
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid json format",
		})

		return
	}

	res, err := h.Service.GetDistance(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to get distance",
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"results": res,
	})

}
