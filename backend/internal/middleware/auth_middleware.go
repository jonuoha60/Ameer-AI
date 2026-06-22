package middleware

import (
	"github.com/gin-gonic/gin"
	"go-modules/internal/auth"

)




func AuthMiddleware(jwtAccessSecret string) gin.HandlerFunc {
	return func(c *gin.Context) {

		token, err := c.Cookie("access_token") 
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "no access token"})
			return
		}

		parsed, err := auth.ValidateToken(token, jwtAccessSecret)
		if err != nil || !parsed.Valid {
			c.AbortWithStatusJSON(401, gin.H{"error": "invalid token"})
			return
		}

		claims := parsed.Claims.(*auth.Claims)

		c.Set("user_id", claims.Subject)

		c.Next()
	}
}