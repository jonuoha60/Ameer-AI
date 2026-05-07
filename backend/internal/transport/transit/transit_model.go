package transit

type Transit struct {
	OriginLat float64 `json:"origin_lat" binding:"required"`
	OriginLng float64 `json:"origin_lng" binding:"required"`
	DestLat   float64 `json:"dest_lat" binding:"required"`
	DestLng   float64 `json:"dest_lng" binding:"required"`
	// Mode        string `json:"mode" binding:"required"`
}

type TransitRouteResponse struct {
	Routes []struct {
		DistanceMeters int    `json:"distanceMeters"`
		Duration       string `json:"duration"`

		TravelAdvisory struct {
			TransitFare struct {
				CurrencyCode string `json:"currencyCode"`
				Units        string `json:"units"`
				Nanos        int    `json:"nanos"`
			} `json:"transitFare"`
		} `json:"travelAdvisory"`

		Legs []struct {
			DistanceMeters int    `json:"distanceMeters"`
			Duration       string `json:"duration"`

			Steps []struct {
				TravelMode     string `json:"travelMode"`
				DistanceMeters int    `json:"distanceMeters"`
				Duration       string `json:"duration"`

				TransitDetails struct {
					Headsign    string `json:"headsign"`
					TransitLine struct {
						Name    string `json:"name"`
						Vehicle struct {
							Type string `json:"type"`
						} `json:"vehicle"`
					} `json:"transitLine"`
				} `json:"transitDetails"`
			} `json:"steps"`
		} `json:"legs"`
	} `json:"routes"`
}
