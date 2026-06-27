import { useEffect, useState } from "react";
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
  const [destType] = useState("");
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
    await axios.post("http://localhost:8080/location", {
      longitude: crd.longitude,
      latitude: crd.latitude,
    });

    // if the backend returns an address, assign it here.

    
  } catch (err) {
    console.error(err);
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
    console.error(err);
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
      console.error("Error fetching coords:", err);
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
        <div className="section-title">Why us?</div>

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
  <svg width="100%" viewBox="0 0 680 380" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 12 }}>
    <defs>
      <style>{`
        .pulse-ring { animation: pulse 2.5s ease-out infinite; opacity: 0; }
        .pulse-ring-2 { animation-delay: 0.8s; }
        .pulse-ring-3 { animation-delay: 1.6s; }
        @keyframes pulse { 0% { r: 4; opacity: 0.7; } 100% { r: 18; opacity: 0; } }
        .route { stroke-dasharray: 400; stroke-dashoffset: 400; animation: draw 2s ease forwards; }
        .route-2 { animation-delay: 0.4s; }
        .route-3 { animation-delay: 0.8s; }
        .route-4 { animation-delay: 1.2s; }
        @keyframes draw { to { stroke-dashoffset: 0; } }
        .pin-dot { animation: popin 0.3s ease forwards; transform-origin: center; opacity: 0; }
        .pin-1 { animation-delay: 0.2s; } .pin-2 { animation-delay: 0.6s; }
        .pin-3 { animation-delay: 1.0s; } .pin-4 { animation-delay: 1.4s; }
        .pin-5 { animation-delay: 1.8s; }
        @keyframes popin { 0%{transform:scale(0);opacity:0} 70%{transform:scale(1.3);opacity:1} 100%{transform:scale(1);opacity:1} }
      `}</style>
      <marker id="mapArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
        <path d="M2 1L8 5L2 9" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </marker>
    </defs>

    {/* Continents */}
    <path d="M60 80 L140 70 L170 85 L180 110 L175 140 L165 160 L155 175 L140 190 L125 200 L110 210 L95 220 L80 215 L70 200 L60 185 L55 165 L50 145 L48 120 Z" fill="#D1FAE5" stroke="#A7F3D0" strokeWidth="0.5"/>
    <path d="M130 225 L165 220 L178 235 L182 260 L178 285 L170 305 L155 318 L140 322 L128 315 L118 295 L115 270 L118 248 Z" fill="#D1FAE5" stroke="#A7F3D0" strokeWidth="0.5"/>
    <path d="M290 60 L340 55 L360 65 L365 80 L358 95 L345 105 L330 108 L318 112 L305 108 L292 100 L285 85 L287 70 Z" fill="#D1FAE5" stroke="#A7F3D0" strokeWidth="0.5"/>
    <path d="M295 125 L340 118 L358 130 L365 155 L362 185 L352 210 L340 230 L325 240 L310 238 L298 225 L290 205 L286 178 L287 152 Z" fill="#D1FAE5" stroke="#A7F3D0" strokeWidth="0.5"/>
    <path d="M370 55 L480 45 L530 60 L550 80 L545 105 L530 120 L510 128 L490 130 L465 125 L445 115 L420 118 L400 112 L385 100 L372 85 L368 68 Z" fill="#D1FAE5" stroke="#A7F3D0" strokeWidth="0.5"/>
    <path d="M490 230 L545 222 L565 235 L568 260 L560 278 L545 288 L525 290 L508 282 L496 265 L490 248 Z" fill="#D1FAE5" stroke="#A7F3D0" strokeWidth="0.5"/>

    {/* Routes */}
    <path className="route" d="M145 140 Q220 90 310 78" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#mapArrow)"/>
    <path className="route route-2" d="M322 82 Q380 75 430 92" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#mapArrow)"/>
    <path className="route route-3" d="M438 94 Q470 80 510 90" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#mapArrow)"/>
    <path className="route route-4" d="M518 97 Q530 160 528 248" fill="none" stroke="#0EA5E9" strokeWidth="1.5" strokeDasharray="6 4" markerEnd="url(#mapArrow)"/>

    {/* Pins */}
    {[
      { cx: 145, cy: 142, label: 'New York', ly: 162 },
      { cx: 322, cy: 80,  label: 'London',   ly: 68  },
      { cx: 438, cy: 96,  label: 'Dubai',    ly: 114 },
      { cx: 518, cy: 92,  label: 'Tokyo',    ly: 108 },
      { cx: 528, cy: 252, label: 'Sydney',   ly: 268 },
    ].map(({ cx, cy, label, ly }, i) => (
      <g key={label} className={`pin-dot pin-${i + 1}`}>
        <circle cx={cx} cy={cy} r={5} fill="#0EA5E9"/>
        <circle cx={cx} cy={cy} r={8} fill="none" stroke="#0EA5E9" strokeWidth="1.2" className="pulse-ring"/>
        <circle cx={cx} cy={cy} r={8} fill="none" stroke="#0EA5E9" strokeWidth="1.2" className="pulse-ring pulse-ring-2"/>
        <text x={cx} y={ly} textAnchor="middle" fontSize={10} fontFamily="Inter, sans-serif" fill="#1E3A5F" fontWeight="500">{label}</text>
      </g>
    ))}
  </svg>
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