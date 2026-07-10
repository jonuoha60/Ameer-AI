package experience

import (
	"go-modules/internal/models"
	"net/http"
	"time"
	"go.mongodb.org/mongo-driver/v2/bson"
	"strconv"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	Service *Service
}

func NewHandler(Service *Service) *Handler {
	return &Handler{Service: Service}
}

func (h *Handler) CreateUserExperience(c *gin.Context) {

	title := c.PostForm("title")
	review := c.PostForm("review")
	from := c.PostForm("from")
	to := c.PostForm("to")
	transport := c.PostForm("transport")
	budget := c.PostForm("budget")
	rating := c.PostForm("rating")
	photoUrl := c.PostForm("photoUrl")

	ratingInt, _ := strconv.Atoi(rating)
	budgetFloat, _ := strconv.ParseFloat(budget, 64)

	experience := models.Experience{
		From:      from,
		To:        to,
		Title:     title,
		Review:    review,
		Rating:    ratingInt,
		Transport: transport,
		Budget:    budgetFloat,
		Image:     photoUrl,
		CreatedAt: time.Now().UTC(),
	}

	userID := c.GetString("user_id")
	objID, _ := bson.ObjectIDFromHex(userID)
	experience.UserID = objID

	created, err := h.Service.CreateExperience(c.Request.Context(), experience)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, created)
}

func (h *Handler) GetUserExperience(c *gin.Context) {

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

	experience, err := h.Service.GetExperience(c.Request.Context(), idStr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"experience": experience,
	})
}

func (h *Handler) GetExperiences(c *gin.Context) {


	experiences, err := h.Service.GetAllExperiences(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"experience": experiences,
	})
}