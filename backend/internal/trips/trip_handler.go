package trips

import (
	"go-modules/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service *Service
}

func NewHandler(Service *Service) *Handler {
	return &Handler{Service: Service}
}

func (h *Handler) CreateTrips(c *gin.Context) {

	var req models.Trip

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid json",
		})
		return
	}

	userIDStr, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized",
		})
		return
	}

	userIDHex, ok := userIDStr.(string)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid user id",
		})
		return
	}

	created, err := h.Service.CreateTrip(c.Request.Context(), req, userIDHex)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, created)
}

func (h *Handler) GetUserTrips(c *gin.Context) {

	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "unauthorized",
		})
		return
	}

	idStr, ok := userID.(string)
	if !ok {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid user id",
		})
		return
	}

	trips, err := h.Service.GetTrips(c.Request.Context(), idStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"trips": trips,
	})
}