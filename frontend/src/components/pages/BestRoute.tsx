import React, { useEffect, useState } from "react";
import {
  Map,
  AdvancedMarker,
  Polyline,
} from "@vis.gl/react-google-maps";
import "../../constants/styles/Route.css";
import { Icons } from "../../constants/styles/icons";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { PlaceAutocomplete } from "../../components/input/AutoComplete";
import { TransportList } from "./Transport";
import { useLocationService, useDistance, useUber, useTransit, useCycling } from '../../hooks/useTransport';
import { transportOptions } from "../../utils/helper";

export const BestRoute = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const { firstId, secondId, lng, lat, lng2, lat2 } = location.state || {};

  const fromLocation = searchParams.get("from");
  const budgetPrice = Number(searchParams.get("budget"));
  const toLocation = searchParams.get("to");

  const [selectedCard, setSelectedCard] = useState<string | null>("bus");

  const [budget, setBudget] = useState<number>(budgetPrice || 0);
  const [from, setFrom] = useState(fromLocation || "");
  const [to, setTo] = useState(toLocation || "");
  const [mode, setMode] = useState("walking");
  const [arrivalSpeed, setArrivalSpeed] = useState("normal");
  const [showType, setShowType] = useState<"distance" | "duration">("distance");
  const [firstPlaceId, setFirstPlaceId] = useState<string>(firstId || "");
  const [secondPlaceId, setSecondPlaceId] = useState<string>(secondId || "");
 
  const [center, setCenter] = useState({
    lat: lat || 43.6532,
    lng: lng || -79.3832,
  });

  const [path, setPath] = useState([
    { lat: lat || 43.6532, lng: lng || -79.3832 },
    { lat: lat2 || 43.6532, lng: lng2 || -79.3832 },
  ]);

  const navigate = useNavigate()

  const handleModeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setMode(e.target.value);
  };


 
const { getLatLngFromPlaceId } = useLocationService();
const { distanceData, getDistance } = useDistance();
const { distanceDataCycling, getDistanceCycling } = useCycling();
const { uberPrice, getUberPrice } = useUber();
const { busData, trainData, getTransitData } = useTransit();

useEffect(() => {
  const fetchCoords = async () => {
    if (!firstPlaceId || !secondPlaceId) return;

    const start = await getLatLngFromPlaceId(firstPlaceId);
    const end = await getLatLngFromPlaceId(secondPlaceId);

    if (start && end) {
      setCenter(start);
      setPath([start, end]);

      getDistance(from, to, mode);
      getDistanceCycling(from, to, "bicycling");
      getUberPrice(from, to, mode);
      getTransitData([start, end]);
    }
  };

  fetchCoords();
}, [firstPlaceId, secondPlaceId, mode, to, from]);
 

  const increaseBudget = () => setBudget((prev) => prev + 1);
  const decreaseBudget = () => setBudget((prev) => Math.max(0, prev - 1));

  const handleAskAmeer = () => {
  navigate("/ameer", {
    state: {
      from,
      to,
      budget,
      arrivalSpeed,

      // distance
      distance: distanceData?.distance || "",
      duration: distanceData?.duration || "",

      // bus
      bus: {
        price: busData?.fare || 0,
        duration: busData?.durationSeconds || "",
        lines: busData?.busNames || [],
      },

      // uber
      uber: {
        price: uberPrice || "0",
      },

      // selected option
      selectedTransport: selectedCard,
    },
  });
};

const handleSwitch = async () => {
  try {

    const prevFrom = from;
    const prevTo = to;

    setFrom(prevTo);
    setTo(prevFrom);

    const prevFirstId = firstPlaceId;
    const prevSecondId = secondPlaceId;

    setFirstPlaceId(prevSecondId);
    setSecondPlaceId(prevFirstId);


    setPath((prev) => [prev[1], prev[0]]);


    await Promise.all([
      getDistance(prevTo, prevFrom, mode),
      getUberPrice(prevTo, prevFrom, mode),
      getTransitData([
        { lat: path[1].lat, lng: path[1].lng },
        { lat: path[0].lat, lng: path[0].lng },
      ]),
    ]);

  } catch (err) {
    console.log("switch error:", err);
  }
};

  return (
    <div className="best-route-container">

      <div className="route-panel">

        <div className="top-nav">
          <h2>Ameer Maps</h2>
        </div>

        <div className="route-locations">
          <div className="route-point">
            <span className="loc-icon"><Icons.Pin /></span>
            <div>
              <div className="loc-label">From</div>
              <PlaceAutocomplete
                className="input-field-route"
                type="text"
                placeholder=""
                value={from}
                callFunc={setFrom}
                onPlaceSelect={async (place) => {
                if (!place) return;
              
                if (place.formatted_address) {
                setFrom(place.formatted_address);
                }
              
                const placeId = place.place_id;
                if (placeId) {
                setFirstPlaceId(placeId)
                setPath((prev => {
                        const newStart = {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng(),
                  }
                          return [newStart, prev[1]]
                            }))
                          };

              
              
                        
                        }}
                          />
            </div>
          </div>
          <div className="route-top">
          <div className="route-divider" />
<button
onClick={handleSwitch}
 className="switch-btn">
  <Icons.Switch />
</button>
          </div>

          <div className="route-point">
            <span className="loc-icon"><Icons.Flag /></span>
            <div>
              <div className="loc-label">To</div>
              <PlaceAutocomplete
                className="input-field-route"
                type="text"
                placeholder=""
                value={to}
                callFunc={setTo}
                onPlaceSelect={(place) => {
                              if (!place) return;
              
                              if (place.formatted_address) {
                                setTo(place.formatted_address);
                              }
                              const placeId = place.place_id;
                              if (placeId) {
                                setSecondPlaceId(placeId)
                                setPath((prev) => {
                                  const newEnd = {
                                lat: place.geometry.location.lat(),
                                lng: place.geometry.location.lng(),
                              }

                              return [prev[0], newEnd]
                            })
                              };
                            }}
                          />
            </div>
          </div>
        </div>

        {/* DISTANCE BOX */}
<div className="route-locations">

  {/* DISTANCE HEADER BLOCK */}
  <div className="route-point">
    
    <span className="loc-icon"><Icons.Map /></span>
    

    <div className="distance-row">

  <div className="distance-left">
    <div className="loc-label">
      {showType === "distance" ? "Distance" : "Duration"}
    </div>

    <input
      className="loc-input"
      value={
        distanceData
          ? showType === "distance"
            ? `${distanceData.distance}`
            : distanceData.duration
          : "Loading..."
      }
      readOnly
    />
  </div>

  <button
    className="toggle-btn"
    onClick={() =>
      setShowType((prev) =>
        prev === "distance" ? "duration" : "distance"
      )
    }
  >
    {showType === "distance" ? "Show Duration" : "Show Distance"}
  </button>

</div>
  </div>

  

  <div className="route-divider-distance" />

  <div className="route-point">
    <span className="loc-icon">
      {mode === "walking" && <Icons.Walk />}
      {mode === "driving" && <Icons.Car />}
      {mode === "bicycling" && <Icons.Bike />}
    </span>

    <div>
      <div className="loc-label">Mode</div>

      <select
        value={mode}
        onChange={handleModeChange}
        className="loc-input"
      >
        <option value="walking">Walking</option>
        <option value="driving">Driving</option>
        <option value="bicycling">Bicycling</option>
      </select>
    </div>
  </div>

</div>

<div className="route-point quick-time">
  <span className="loc-icon">
    <Icons.Map />
  </span>

  <div>
    <div className="loc-label quick-time-label">
      How quickly do you want to get there?
    </div>

    <select
  value={arrivalSpeed}
  onChange={(e) => setArrivalSpeed(e.target.value)}
  className="loc-input quick-time-input"
>
  <option value="asap">As soon as possible</option>
  <option value="fast">I'm in a bit of a hurry</option>
  <option value="normal">No rush</option>
  <option value="relaxed">Not in a hurry</option>
  <option value="flexible">I'm flexible with time</option>
</select>
  </div>
</div>

        <div className="budget-box">
          <div className="budget-header">Current Budget ($CAD)</div>

          <div className="budget-controls">
            <button onClick={decreaseBudget}>-</button>
            <input
              className="budget-input"
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
            <button onClick={increaseBudget}>+</button>
          </div>
        </div>

        {/* TRANSPORT */}
        <div className="transport-list">

          <button
            className="budget-refresh-btn"
            onClick={() => {
              getDistance(from, to, mode);
              getUberPrice(from, to, mode);
              getTransitData(path);
            }}
          >
            <Icons.Refresh />
            Refresh
          </button>

<TransportList
  transportOptions={transportOptions}
  selectedCard={selectedCard}
  setSelectedCard={setSelectedCard}
  busData={busData}
  trainData={trainData}
  uberPrice={uberPrice}
  bikeMinutes={distanceDataCycling?.duration}
  bikeCost={distanceDataCycling?.cost}
  budget={budget}
/>

        </div>
  <button onClick={handleAskAmeer} className="ask-ameer-btn">Ask Ameer</button>

      </div>

      <div className="map-panel">
        <Map defaultCenter={center} defaultZoom={12} mapId="DEMO_MAP_ID">
          <AdvancedMarker position={path[0]} />
          <AdvancedMarker position={path[path.length - 1]} />
          <Polyline
            onPathChanged={newPath => setPath(newPath.map(p => p.toJSON()))}

           path={path} strokeColor="#2563eb" strokeWeight={4} />
        </Map>
      </div>

    </div>
  );
};