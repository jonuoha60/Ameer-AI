package maps

import (
	"encoding/json"
	"fmt"
	"go-modules/internal/models"
	"log"
	"net/http"
	"net/url"
	"time"
)

type Service struct {
	APIKey string
	Client *http.Client
}

func NewService(apiKey string) *Service {
	return &Service{
		APIKey: apiKey,
		Client: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (s *Service) ReverseGeocode(loc models.Location) (string, error) {
	u, err := url.Parse("https://maps.googleapis.com/maps/api/geocode/json")
	if err != nil {
		return "", err
	}

	q := u.Query()
	q.Set("latlng", fmt.Sprintf("%f,%f", loc.Latitude, loc.Longitude))
	q.Set("key", s.APIKey)
	u.RawQuery = q.Encode()

	res, err := s.Client.Get(u.String())
	if err != nil {
		log.Printf("request error: %v", err)
		return "", err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Printf("bad response: %s", res.Status)
		return "", fmt.Errorf("external API error")
	}

	var data models.GeoCodingResult
	if err := json.NewDecoder(res.Body).Decode(&data); err != nil {
		log.Printf("decode error: %v", err)
		return "", err
	}

	if len(data.Results) == 0 {
		return "", fmt.Errorf("no results found")
	}

	return data.Results[0].FormattedAddress, nil
}

func (s *Service) GetLongLat(plc models.Place) (models.Location, error) {
	u, err := url.Parse("https://maps.googleapis.com/maps/api/geocode/json")
	if err != nil {
		return models.Location{}, err
	}

	q := u.Query()
	q.Set("place_id", plc.PlaceId)
	q.Set("key", s.APIKey)
	u.RawQuery = q.Encode()

	res, err := s.Client.Get(u.String())
	if err != nil {
		log.Printf("request error: %v", err)
		return models.Location{}, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		log.Printf("bad response: %s", res.Status)
		return models.Location{}, fmt.Errorf("external API error")
	}

	var data models.PlaceCodeResult
	if err := json.NewDecoder(res.Body).Decode(&data); err != nil {
		log.Printf("decode error: %v", err)
		return models.Location{}, err
	}

	if len(data.Results) == 0 {
		return models.Location{}, fmt.Errorf("no results found")
	}

	loc := data.Results[0].Geometry.Location

	return models.Location{
		Latitude:  loc.Lat,
		Longitude: loc.Lng,
	}, nil
}

func (s *Service) GetDistance(dist models.Distance) (models.DistanceResult, error) {
	u, err := url.Parse("https://maps.googleapis.com/maps/api/distancematrix/json")
	if err != nil {
		return models.DistanceResult{}, err
	}

	q := u.Query()
	q.Set("destinations", dist.Destination)
	q.Set("origins", dist.Origin)
	q.Set("units", "metric")
	q.Set("mode", dist.Mode)
	q.Set("key", s.APIKey)

	if dist.Mode == "driving" {
		q.Set("departure_time", "now")
		q.Set("traffic_model", "best_guess")
	}

	if dist.Mode == "transit" {
		q.Set("transit_mode", "train|tram|subway")
	}

	u.RawQuery = q.Encode()

	res, err := s.Client.Get(u.String())
	if err != nil {
		return models.DistanceResult{}, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return models.DistanceResult{}, fmt.Errorf("bad response: %s", res.Status)
	}

	var data struct {
		Rows []struct {
			Elements []struct {
				Status string `json:"status"`

				Distance struct {
					Text  string `json:"text"`
					Value int    `json:"value"` // meters
				} `json:"distance"`

				Duration struct {
					Text  string `json:"text"`
					Value int    `json:"value"` // seconds
				} `json:"duration"`

				DurationInTraffic struct {
					Text  string `json:"text"`
					Value int    `json:"value"` // seconds
				} `json:"duration_in_traffic"`
			} `json:"elements"`
		} `json:"rows"`
	}

	if err := json.NewDecoder(res.Body).Decode(&data); err != nil {
		return models.DistanceResult{}, err
	}

	if len(data.Rows) == 0 || len(data.Rows[0].Elements) == 0 {
		return models.DistanceResult{}, fmt.Errorf("no results found")
	}

	el := data.Rows[0].Elements[0]

	if el.Status != "OK" {
		return models.DistanceResult{}, fmt.Errorf("api error: %s", el.Status)
	}

	distanceKm := float64(el.Distance.Value)
	durationMin := float64(el.Duration.Value) / 60

	if el.DurationInTraffic.Value > 0 {
		durationMin = float64(el.DurationInTraffic.Value) / 60
	}

	return models.DistanceResult{
		Distance: distanceKm,
		Duration: durationMin,
	}, nil
}
