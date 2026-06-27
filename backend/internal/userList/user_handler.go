package userList

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

func (h *Handler) GoogleCreateUser(c *gin.Context) {
	var req models.GoogleAuthRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid json",
		})
		return
	}

	created, err := h.Service.GoogleSignup(c.Request.Context(), req.Token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	if created == (AuthResponse{}) {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create user",
		})
		return
	}

	c.SetCookie(
		"refresh_token",
		created.RefreshToken,
		60*60*24*7,
		"/",
		"",
		true,
		true,
	)

	c.SetCookie(
		"access_token",
		created.AccessToken,
		60*15,
		"/",
		"",
		true,
		true,
	)

	c.JSON(http.StatusCreated, created)
}
func (h *Handler) CreateUser(c *gin.Context) {
	var req models.User

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid json",
		})
		return
	}

	created, err := h.Service.Register(c.Request.Context(), req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	if created == (AuthResponse{}) {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Failed to create user",
		})
		return
	}

	c.SetCookie(
		"refresh_token",
		created.RefreshToken,
		60*60*24*7,
		"/",
		"",
		true,
		true,
	)

	c.SetCookie(
		"access_token",
		created.AccessToken,
		60*15,
		"/",
		"",
		true,
		true,
	)

	c.JSON(http.StatusCreated, created)
}

func (h *Handler) GetUser(c *gin.Context) {
	var req models.CreateUserRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "Invalid json",
		})
		return
	}

	user, err := h.Service.Login(c.Request.Context(), req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "refresh_token",
		Value:    user.RefreshToken,
		Path:     "/",
		MaxAge:   60 * 60 * 24 * 7,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})

	http.SetCookie(c.Writer, &http.Cookie{
		Name:     "access_token",
		Value:    user.AccessToken,
		Path:     "/",
		MaxAge:   60 * 15,
		HttpOnly: true,
		Secure:   true,
		SameSite: http.SameSiteNoneMode,
	})

	c.JSON(http.StatusOK, user)
}
