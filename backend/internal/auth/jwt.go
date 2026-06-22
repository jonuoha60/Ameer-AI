package auth

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

type Claims struct {
	jwt.RegisteredClaims

	Role string `json:"role"`
}

func CreateTokenPair(jwtRefresh, jwtAccess, userID, role string) (string, string, error) {
	now := time.Now().UTC()
	refreshExp := now.Add(7 * 24 * time.Hour)

	refreshClaims := Claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(refreshExp),
		},
		Role: role,
	}

	tok := jwt.NewWithClaims(jwt.SigningMethodHS256, refreshClaims)

	refreshToken, err := tok.SignedString([]byte(jwtRefresh))

	if err != nil {
		return "", "", fmt.Errorf("refresh token failed: %w", err)
	}

	accessClaims := Claims{
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(15 * time.Minute)),
		},
		Role: role,
	}
	accessTokenObj := jwt.NewWithClaims(jwt.SigningMethodHS256, accessClaims)

	accessToken, err := accessTokenObj.SignedString([]byte(jwtAccess))
	if err != nil {
		return "", "", fmt.Errorf("access token failed: %w", err)
	}

	return accessToken, refreshToken, nil

}

func ValidateToken(tokenString, secret string) (*jwt.Token, error) {
	return jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(secret), nil
	})
}
