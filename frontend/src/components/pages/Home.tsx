import React, { useEffect, useState } from "react";
import "../../constants/styles/Home.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Header } from "./Header";
import { Icons } from "../../constants/styles/icons";
import { PlaceAutocomplete } from "../../components/input/AutoComplete";
import Landing from "../../assets/landing.png";
import { Footer } from "./Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [budget, setBudget] = useState("");
  const [destType, setDestType] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>("bus");
  const [longitude, setLongitude] = useState<number | null>(null);
  const [latitude, setLatitude] = useState<number | null>(null);
  const [secondLongitude, setSecondLongitude] = useState<number | null>(null);
  const [secondLatitude, setSecondLatitude] = useState<number | null>(null);

  const [firstPlaceId, setFirstPlaceId] = useState("")
  const [secondPlaceId, setSecondPlaceId] = useState("")
  const [errors, setErrors] = useState<{
    from?: string;
    to?: string;
    budget?: string;
    destType?: string;
  }>({});

  const validate = () => {
  const newErrors: any = {};

  if (!from) newErrors.from = "Please enter your starting location";
  if (!to && !destType) newErrors.to = "Enter a destination or select a type";
  if (!budget) newErrors.budget = "Budget is required";
  if (budget && Number(budget) <= 0) newErrors.budget = "Budget must be greater than 0";

  setErrors(newErrors);

  return Object.keys(newErrors).length === 0;
};



  const success = async(pos: GeolocationPosition) => {
  const crd = pos.coords;
  

  try {
    const res = await axios.post("http://localhost:8080/location", {
      longitude: crd.longitude,
      latitude: crd.latitude
    })

    // if (res.data) {
    //   setFrom(res.data.address)
      
    // }

    
  }catch(err) {
    console.log(err)
  }


}

function error(err: unknown | any) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}
    
  useEffect(() => {
  if (latitude !== null && longitude !== null) return; 

  const userLocation = navigator.geolocation;
  userLocation.getCurrentPosition(success, error);
}, []);

  

 const handleSearch = async () => {
  if (!validate()) return;

  try {
    navigate(
      `/best-route/results?from=${from}&to=${to || destType}&budget=${budget}`,
      {
        state: {
          lng: longitude,
          lat: latitude,
          lng2: secondLongitude,
          lat2: secondLatitude,
          firstId: firstPlaceId,
          secondId: secondPlaceId,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

  const getLatLngFromPlaceId = async (placeId: string) => {
    try {
      const res = await axios.post("http://localhost:8080/location/place", {
        place_id: placeId,
      });

      const data = res.data;

      return {
        lat: data.results.latitude,
        lng: data.results.longitude,
      };
    } catch (err) {
      console.log("Error fetching coords:", err);
      return null;
    }
  };

 

 

  const features = [
    { Icon: Icons.Map,      title: "Smart route comparison",  desc: "Compare Uber, bus, train, and bike costs side-by-side in real time." },
    { Icon: Icons.Bot,      title: "AI travel buddy",         desc: "Get personalized itineraries, local tips, and budget advice on demand." },
    { Icon: Icons.Dollar,   title: "Live budget tracking",    desc: "Track spending by category and get alerts before you go over budget." },
    { Icon: Icons.Users,    title: "Group trip splitting",    desc: "Split costs fairly across your travel group with one tap." },
    { Icon: Icons.Globe,    title: "Multi-currency support",  desc: "Travel internationally without the currency confusion." },
    { Icon: Icons.History,  title: "Trip history",            desc: "See what you planned vs. what you actually spent on every past trip." },
  ];

  return (
    <div>
  <div className="ameer-root">

    {/* NAVBAR */}
    <Header home={true} />

    {/* HERO */}
    <div className="hero">
      <div className="hero-left">
        <h2>Travel Smarter not Harder.</h2>
        <p>
          Compare routes, track your budget, and get real-time travel advice — no matter where you're headed.
        </p>

        <div className="search-box">

          {/* FROM */}
          <div className={`input-row ${errors.from ? "input-error" : ""}`}>
            <span className="input-icon2"><Icons.Pin /></span>

            <PlaceAutocomplete
              className="input-field"
              type="text"
              placeholder="Where are you now?"
              value={from}
              callFunc={setFrom}
              onBlur={() => {
                if (!firstPlaceId) {
                  setFrom("")
                }
              }}
              onPlaceSelect={async (place) => {
            if (!place) {
              return
            };

            if (place.formatted_address) {
              setFrom(place.formatted_address);
            }

            const placeId = place.place_id;
            if(placeId) {
              setFirstPlaceId(placeId);
              const coords = await getLatLngFromPlaceId(placeId);

            if (coords) {
              setLatitude(coords.lat);
              setLongitude(coords.lng);
            }
              }

           
          }}
            />
          </div>


          {/* TO */}
          <div className={`input-row ${errors.to ? "input-error" : ""}`}>
            <span className="input-icon2"><Icons.Flag /></span>

          
            <PlaceAutocomplete
              className="input-field"
              type="text"
              placeholder="Where to?"
              value={to}
              callFunc={setTo}
              onBlur={() => {
                if (!secondPlaceId) {
                  setTo("")
                }
              }}
              onPlaceSelect={async(place) => {
                if (!place) return;


                if (place.formatted_address) {
                  setTo(place.formatted_address);
                }

                if(place.place_id) {
                  setSecondPlaceId(place.place_id);
                }

              const placeId = place.place_id;
            if(placeId) {
              const coords = await getLatLngFromPlaceId(placeId);

            if (coords) {
              setSecondLatitude(coords.lat);
              setSecondLongitude(coords.lng);
            }
              }
                
              }}
            />
          </div>


          {/* DEST TYPE */}
          {/* <div className="divider">or pick a destination type</div> */}

          {/* <div className={`input-row ${errors.destType ? "input-error" : ""}`}>
            <span className="input-icon2"><Icons.Map /></span>

            <select
              value={destType}
              className="input-field"
              onChange={(e) => setDestType(e.target.value)}
            >
              <option value="">Choose a place type...</option>
              <optgroup label="Attractions">
                <option>Tourist attraction</option>
                <option>Museum or gallery</option>
                <option>Historical landmark</option>
                <option>Theme park</option>
                <option>National park / nature</option>
                <option>Beach or waterfront</option>
              </optgroup>
              <optgroup label="Food & Drink">
                <option>Restaurant</option>
                <option>Cafe or coffee shop</option>
                <option>Bar or nightlife</option>
                <option>Food market</option>
              </optgroup>
              <optgroup label="Shopping">
                <option>Shopping mall</option>
                <option>Local market / bazaar</option>
                <option>Outlet store</option>
              </optgroup>
              <optgroup label="Stay">
                <option>Hotel</option>
                <option>Hostel</option>
                <option>Airbnb / rental</option>
                <option>Campsite</option>
              </optgroup>
              <optgroup label="Transport hubs">
                <option>Airport</option>
                <option>Train station</option>
                <option>Bus terminal</option>
                <option>Ferry terminal</option>
              </optgroup>
            </select>
          </div>

          {errors.to && !to && !destType && (
            <div className="error-text">{errors.to}</div>
          )} */}

          {/* BUDGET */}
          <div className={`input-row ${errors.budget ? "input-error" : ""}`}>
            <span className="input-icon2"><Icons.Dollar /></span>

            <input
              type="number"
              placeholder="Your budget ($)"
              value={budget}
              className="input-field"
              onChange={(e) => setBudget(e.target.value)}
            />
          </div>

          <button className="search-btn" onClick={handleSearch}>
            Find best route <Icons.ArrowRight />
          </button>

          <div className="ai-badge">
            <div className="ai-dot" />
            AI-powered route & cost comparison
          </div>

        </div>
      </div>

      <div className="hero-right">
        <img src={Landing} alt="Hero" className="hero-img" />
      </div>
    </div>

    {/* FEATURES */}
    <div className="sections">
      <div>
        <div className="section-title">Everything a traveller needs</div>
        <div className="section-sub">
          Built for solo travellers, groups, and everyone in between.
        </div>

        <div className="features-grid">
          {features.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon"><f.Icon /></div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-desc">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>

<div className="about-section">
  <div className="about-content">
    <div className="about-text">
        <div className="section-title">Ameer AI</div>

      <p>
        Ameer AI is a travel planner agent built to help travellers all over the world navigate safely.
        Travellers get the ability to compare transportation
        options, manage budgets, and make smarter travel decisions
        without jumping between multiple apps. Ameer AI is the ultimate travel companion for the modern explorer.
      </p>

      <p>
        This project combines real-time routing, AI-powered travel
        assistance, and budget tracking into one clean experience.
        Whether you're planning a solo adventure or a group trip,
        the goal is to make travel simpler, cheaper, and less stressful.
      </p>

      <button
        className="about-btn"
        onClick={() => navigate("/about")}
      >
        Learn More
      </button>
    </div>

    <div className="about-image">
      <img src={Landing} alt="About me" />
    </div>
  </div>
</div>
    </div>

  </div>
  <Footer />
  </div>
);
};

export default Home;