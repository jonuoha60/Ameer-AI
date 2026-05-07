package refresh

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Handler struct {
	service *Service
}

func NewHandler(service *Service) *Handler {
	return &Handler{service: service}
}

type RefreshTokenRequest struct {
	RefreshToken string `json:"refresh_token" binding:"required"`
}

func (h *Handler) RefreshToken(c *gin.Context) {

	refreshToken, err := c.Cookie("refresh_token")
	fmt.Printf("COOKIE TOKEN: %q\n", refreshToken)

	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Refresh token not provided"})
		return
	}

	resp, err := h.service.Create(c.Request.Context(), refreshToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.SetCookie(
		"refresh_token",
		resp.RefreshToken,
		7*24*3600,
		"/",
		"",
		false,
		true,
	)

	c.JSON(http.StatusOK, gin.H{
		"access_token": resp.AccessToken,
		"user":         resp.User,
	})
}
