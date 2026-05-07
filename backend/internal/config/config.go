package config

import (
	"fmt"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	MongoURI   string
	MongoDB    string
	ServerPort string
	GoogleMap  string
	Gemini     string
	JWTRefresh string
	JWTAccess  string
}

func Load() (Config, error) {

	if err := godotenv.Load(); err != nil {
		return Config{}, fmt.Errorf("Failed to load env")
	}

	mongoURI, err := extractEnv("MONGO_URI")

	if err != nil {
		return Config{}, err
	}

	mongoDB, err := extractEnv("MONGO_DB_NAME")

	if err != nil {
		return Config{}, err
	}

	port, err := extractEnv("PORT")

	if err != nil {
		return Config{}, err
	}

	googleMap, err := extractEnv("GOOGLE_MAP_API")

	if err != nil {
		return Config{}, err
	}

	gemini, err := extractEnv("GEMINI_API_KEY")

	if err != nil {
		return Config{}, err
	}

	jwtRefresh, err := extractEnv("JWT_REFRESH")

	if err != nil {
		return Config{}, err
	}

	jwtAccess, err := extractEnv("JWT_ACCESS")

	if err != nil {
		return Config{}, err
	}

	return Config{
		MongoURI:   mongoURI,
		MongoDB:    mongoDB,
		ServerPort: port,
		GoogleMap:  googleMap,
		Gemini:     gemini,
		JWTRefresh: jwtRefresh,
		JWTAccess:  jwtAccess,
	}, nil

}

func extractEnv(key string) (string, error) {
	val := os.Getenv(key)

	if val == "" {
		return "", fmt.Errorf("Empty value")
	}

	return val, nil
}
