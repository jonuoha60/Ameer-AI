package main

import (
	"encoding/json"
	"fmt"
	"go-modules/internal/config"
	"go-modules/internal/db"
	"go-modules/internal/server"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

type TestRequest struct {
	Name string `json:"name"`
}

type RouteRequest struct {
	To   string `json:"to"`
	From string `json:"from"`
}
type CatFactResponse struct {
	Fact   string `json:"fact"`
	Length int    `json:"length"`
}

func enableCors(w http.ResponseWriter) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
}

func parseLevel(s string) (int, error) {
	n, err := strconv.Atoi(s)

	if err != nil {
		return 0, fmt.Errorf("level")
	}

	return n, nil
}

func run() error {
	input := "3"

	result, err := parseLevel(input)

	if err != nil {
		return err
	}

	fmt.Println("", result)

	return nil
}

func main() {
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Config error: %v", err)
	}

	mongoClient, database, err := db.Connect(cfg)
	if err != nil {
		log.Fatalf("db error: %v", err)
	}

	defer func() {
		if err := db.Disconnect(mongoClient); err != nil {
			log.Printf("mongo disconnect error: %v", err)
		}
	}()

	router := server.NewRouter(database, cfg)

	addr := fmt.Sprintf(":%s", cfg.ServerPort)

	if err := router.Run(addr); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}

func externalHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"ok":    false,
			"error": "Only a get request",
		})
		return
	}

	data, err := fetchCatFact()

	if err != nil {
		writeJSON(w, http.StatusBadGateway, map[string]any{
			"ok":    false,
			"error": "Failed to fetch data",
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"ok": true,
		"external": map[string]any{
			"source": "Catfact.ninja",
			"fact":   data.Fact,
			"length": data.Length,
		},
	})
}

func fetchCatFact() (CatFactResponse, error) {
	url := "https://catfact.ninja/fact"

	res, err := http.Get(url)

	if err != nil {
		return CatFactResponse{}, err
	}

	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return CatFactResponse{}, fmt.Errorf("external api failed: %s", res.Status)
	}

	bodyBytes, err := io.ReadAll(res.Body)

	if err != nil {
		return CatFactResponse{}, err
	}

	var data CatFactResponse

	if err := json.Unmarshal(bodyBytes, &data); err != nil {
		return CatFactResponse{}, err
	}

	return data, nil
}

func routeHandler(w http.ResponseWriter, r *http.Request) {
	enableCors(w)
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"ok":    false,
			"error": "This is a post method",
		})
		return
	}

	defer r.Body.Close()

	var req RouteRequest

	dec := json.NewDecoder(r.Body)

	if err := dec.Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{
			"ok":    false,
			"error": "Incorrect json format",
		})
		return
	}

	req.To = strings.TrimSpace(req.To)
	req.From = strings.TrimSpace(req.From)

	if req.To == "" || req.From == "" {
		writeJSON(w, http.StatusBadRequest, map[string]any{
			"ok":    false,
			"error": "Destinations can't be empty",
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"ok":        true,
		"data":      req,
		"timeStamp": time.Now().UTC(),
	})

}

func greet(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")

	if name == "" {
		name = "Guest"
	}

	if r.Method != http.MethodGet {
		http.Error(w, "Only Get is allowed", http.StatusMethodNotAllowed)
		return
	}
	fmt.Fprintf(w, "Hello World! %s", name)

}

func writeJSON(w http.ResponseWriter, status int, data any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(data)
}

func testHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		writeJSON(w, http.StatusMethodNotAllowed, map[string]any{
			"ok":    false,
			"error": "Only post is allowed",
		})
		return
	}

	defer r.Body.Close()

	var req TestRequest

	dec := json.NewDecoder(r.Body)

	if err := dec.Decode(&req); err != nil {
		writeJSON(w, http.StatusBadRequest, map[string]any{
			"ok":    false,
			"error": "Invalid json format",
		})
		return
	}

	req.Name = strings.TrimSpace(req.Name)

	if req.Name == "" {
		writeJSON(w, http.StatusBadRequest, map[string]any{
			"ok":    false,
			"error": "Name can't be empty",
		})
		return
	}

	writeJSON(w, http.StatusOK, map[string]any{
		"ok":        true,
		"data":      req,
		"timeStamp": time.Now().UTC(),
	})

}

func successHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	w.WriteHeader(http.StatusOK)

	res := map[string]any{
		"ok":       true,
		"message":  "JSON encode successful",
		"datetime": time.Now().UTC(),
	}

	_ = json.NewEncoder(w).Encode(res)
}
