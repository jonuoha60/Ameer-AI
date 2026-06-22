package helper

import "math"

func GetUberRates(mode string) (base, perKm, perMin float64) {
	switch mode {
	case "uberx":
		return 2.50, 1.20, 0.25
	case "uberxl":
		return 3.50, 1.80, 0.35
	default:
		return 2.00, 1.00, 0.20
	}
}

func CalculateUberRates(base, perKm, perMin, totalDistanceKm, totalTimeMin float64) float64 {
	distance := math.Round(totalDistanceKm*10) / 10
	time := math.Ceil(totalTimeMin)

	price := base + (perKm * distance) + (perMin * time)

	minFare := 5.00
	if price < minFare {
		price = minFare
	}

	return math.Round(price*100) / 100
}
