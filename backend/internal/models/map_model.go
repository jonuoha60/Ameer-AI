package models

type Location struct {
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

type Place struct {
	PlaceId string `json:"place_id"`
}

type Distance struct {
	Destination string `json:"destinations"`
	Origin      string `json:"origins"`
	Mode        string `json:"mode"`
}

type DistanceResult struct {
	Distance float64 `json:"distance"`
	Duration float64 `json:"duration"`
	Traffic  float64 `json:"duration_in_traffic"`
}

type PlaceCodeResult struct {
	Results []struct {
		Geometry struct {
			Location struct {
				Lat float64 `json:"lat"`
				Lng float64 `json:"lng"`
			} `json:"location"`
		} `json:"geometry"`
	} `json:"results"`
}

type GeoCodingResult struct {
	Results []struct {
		FormattedAddress string   `json:"formatted_address"`
		Types            []string `json:"types"`
	} `json:"results"`
}
