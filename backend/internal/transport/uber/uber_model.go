package uber

type Uber struct {
	BasePayment float64 `json:"base_payment"`
	PerKm       float64 `json:"per_km"`
	PerMin      float64 `json:"per_min"`
	Mode        string  `json:"mode"`

	Origin      string `json:"origins"`
	Destination string `json:"destinations"`

	
}

type UberResult struct {
	EstimatedPrice float64 `json:"estimated_price"`
	DistanceKm     float64 `json:"distance_km"`
	DurationMin    float64 `json:"duration_min"`
}
