import { useState, useCallback } from "react";
import axios from "axios";
import { formatedDuration } from "../utils/helper/index";


export const useUber = () => {
  const [uberPrice, setUberPrice] = useState("");

  const getUberPrice = useCallback(async (from: string, to: string, mode: string) => {
    const uberMode = mode === "driving" ? "uber-xl" : "";

    try {
      const res = await axios.post(
        "http://localhost:8080/transport/uber",
        {
          origins: from,
          destinations: to,
          mode: uberMode,
        }
      );

      const price = Number(res.data.data.estimated_price).toFixed(2);
      setUberPrice(price);
    } catch (err) {
      console.log("uber error:", err);
    }
  }, []);

  return { uberPrice, getUberPrice };
};


export const useLocationService = () => {
  const getLatLngFromPlaceId = useCallback(async (placeId: string) => {
    try {
      const res = await axios.post("http://localhost:8080/location/place", {
        place_id: placeId,
      });

      return {
        lat: res.data.results.latitude,
        lng: res.data.results.longitude,
      };
    } catch (err) {
      console.log("place error:", err);
      return null;
    }
  }, []);

  return { getLatLngFromPlaceId };
};


export const useDistance = () => {
  const [distanceData, setDistanceData] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  const getDistance = useCallback(async (from: string, to: string, mode: string) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/location/distance",
        {
          origins: from,
          destinations: to,
          mode,
        }
      );

      const element = res.data.results;

      const totalMinutes = element.duration;

      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = (totalMinutes % 60).toFixed(1);

      const formattedDuration =
        days > 0
          ? `${days} day${days > 1 ? "s" : ""} ${hours} hr ${minutes} min`
          : hours > 0
          ? `${hours} hr ${minutes} min`
          : `${minutes} min`;

      const meters = Math.floor(element.distance);

      let formattedDistance;

      if (meters >= 1000) {
        const km = meters / 1000;
        formattedDistance = `${km.toFixed(1)} km`;
      } else {
        formattedDistance = `${meters.toLocaleString()} m`;
      }

      setDistanceData({
        distance: formattedDistance,
        duration: formattedDuration,
      });
    } catch (err) {
      console.log("distance error:", err);
    }
  }, []);

  return { distanceData, getDistance };
};

export const useCycling = () => {
  const [distanceDataCycling, setDistanceData] = useState<{
    distance: string;
    duration: string;
    cost: string;
  } | null>(null);

 const getDistanceCycling = useCallback(
  async (from: string, to: string, mode: string) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/location/distance",
        {
          origins: from,
          destinations: to,
          mode,
        }
      );

      const element = res.data.results;

      const totalMinutes = Number(element.duration); // ✅ already in minutes

      const days = Math.floor(totalMinutes / (60 * 24));
      const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
      const minutes = (totalMinutes % 60).toFixed(1);

      const formattedDuration =
        days > 0
          ? `${days} day${days > 1 ? "s" : ""} ${hours} hr ${minutes} min`
          : hours > 0
          ? `${hours} hr ${minutes} min`
          : `${minutes} min`;

      const meters = Math.floor(element.distance);

      let formattedDistance;
      if (meters >= 1000) {
        const km = meters / 1000;
        formattedDistance = `${km.toFixed(1)} km`;
      } else {
        formattedDistance = `${meters.toLocaleString()} m`;
      }

      const cost = (totalMinutes * 0.2).toFixed(2); // $0.20 per min

      setDistanceData({
        distance: formattedDistance,
        duration: formattedDuration,
        cost: `$${cost}`, 
      });

    } catch (err) {
      console.log("distance error:", err);
    }
  },
  []
);

  return { distanceDataCycling, getDistanceCycling };
};


export const useTransit = () => {
  const [busData, setBusData] = useState<any>(null);
  const [trainData, setTrainData] = useState<any>(null);

  const getTransitData = useCallback(async (path: any[]) => {
    try {
      const res = await axios.post(
        "http://localhost:8080/transport/transit",
        {
          origin_lat: path[0].lat,
          origin_lng: path[0].lng,
          dest_lat: path[1].lat,
          dest_lng: path[1].lng,
        }
      );

      const route = res.data.routes?.[0];
      const steps = route?.legs?.[0]?.steps || [];

      let busCount = 0;
      let trainCount = 0;

      let busNames: string[] = [];
      let trainNames: string[] = [];

      const durationSec = route?.duration || "0s";

      steps.forEach((step: any) => {
        if (step.travelMode === "TRANSIT") {
          const vehicleType =
            step.transitDetails?.transitLine?.vehicle?.type;

          const name =
            step.transitDetails?.transitLine?.name || "Transit";

          if (vehicleType === "BUS") {
            busCount++;
            busNames.push(name);
          }

          if (
            vehicleType === "HEAVY_RAIL" ||
            vehicleType === "SUBWAY" ||
            vehicleType === "LIGHT_RAIL"
          ) {
            trainCount++;
            trainNames.push(name);
          }
        }
      });

      const totalSeconds = Number(durationSec.slice(0, -1));
      const formatted = formatedDuration(totalSeconds);

      const busFare = busCount * 3.25;
      const trainFare = trainCount * 6;

      setBusData({
        busCount,
        busNames,
        durationSeconds: formatted,
        fare: busFare,
      });

      setTrainData({
        trainCount,
        trainNames,
        duration: formatted,
        fare: trainFare,
      });

    } catch (err) {
      console.log("transit error:", err);
    }
  }, []);

  return { busData, trainData, getTransitData };
};