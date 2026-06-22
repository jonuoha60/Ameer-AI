package uber

import (
	"bytes"
	"encoding/json"
	"fmt"
	"go-modules/internal/transport/helper"
	"math"
	"net/http"
	"net/url"
	"time"
)

type Service struct {
	Client *http.Client
}

func NewService() *Service {
	return &Service{
		Client: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (s *Service) UberPricing(ubr Uber) (UberResult, error) {
	u, err := url.Parse("http://localhost:8080/location/distance")
	if err != nil {
		return UberResult{}, err
	}

	payload := map[string]string{
		"origins":      ubr.Origin,
		"destinations": ubr.Destination,
		"mode":         "driving",
	}

	jsonData, err := json.Marshal(payload)
	if err != nil {
		return UberResult{}, err
	}

	res, err := s.Client.Post(u.String(), "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return UberResult{}, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return UberResult{}, fmt.Errorf("internal API error")
	}

	var distanceData struct {
		Results struct {
			Distance float64 `json:"distance"`
			Duration float64 `json:"duration"`
		} `json:"results"`
	}

	if err := json.NewDecoder(res.Body).Decode(&distanceData); err != nil {
		return UberResult{}, err
	}

	distanceKm := distanceData.Results.Distance / 1000

	distanceKm = math.Round(distanceKm*10) / 10 // 1 decimal
	durationMin := math.Ceil(distanceData.Results.Duration)

	base, perKm, perMin := helper.GetUberRates(ubr.Mode)

	price := base + (perKm * distanceKm) + (perMin * durationMin)

	// minimum fare (realistic)
	if price < 5.00 {
		price = 5.00
	}

	price = math.Round(price*100) / 100

	return UberResult{
		EstimatedPrice: price,
		DistanceKm:     distanceData.Results.Distance,
		DurationMin:    distanceData.Results.Duration,
	}, nil
}
