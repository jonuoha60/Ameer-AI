package transit

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type Service struct {
	Client *http.Client
	APIKey string
}

func NewService(apiKey string) *Service {
	return &Service{
		APIKey: apiKey,
		Client: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (s *Service) TransitPricing(tr Transit) (TransitRouteResponse, error) {

	u := "https://routes.googleapis.com/directions/v2:computeRoutes"

	payload := map[string]any{
		"origin": map[string]any{
			"location": map[string]any{
				"latLng": map[string]float64{
					"latitude":  tr.OriginLat,
					"longitude": tr.OriginLng,
				},
			},
		},
		"destination": map[string]any{
			"location": map[string]any{
				"latLng": map[string]float64{
					"latitude":  tr.DestLat,
					"longitude": tr.DestLng,
				},
			},
		},
		"travelMode":               "TRANSIT",
		"computeAlternativeRoutes": true,

		"transitPreferences": map[string]any{
			"routingPreference":  "LESS_WALKING",
			"allowedTravelModes": []string{"TRAIN"},
		},
	}

	jsonBody, err := json.Marshal(payload)
	if err != nil {
		return TransitRouteResponse{}, err
	}

	req, err := http.NewRequest("POST", u, bytes.NewBuffer(jsonBody))
	if err != nil {
		return TransitRouteResponse{}, err
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("X-Goog-Api-Key", s.APIKey)

	req.Header.Set("X-Goog-FieldMask",
		"routes.distanceMeters,routes.duration,routes.travelAdvisory.transitFare,routes.legs",
	)
	res, err := s.Client.Do(req)
	if err != nil {
		return TransitRouteResponse{}, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return TransitRouteResponse{}, fmt.Errorf("API error: %s", res.Status)
	}

	var transit TransitRouteResponse
	if err := json.NewDecoder(res.Body).Decode(&transit); err != nil {
		return TransitRouteResponse{}, err
	}

	return transit, nil
}
