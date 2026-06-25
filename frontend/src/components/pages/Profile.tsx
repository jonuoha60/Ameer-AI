import { useEffect, useState, useRef } from "react";
import "../../constants/styles/Profile.css";
import { useAuth } from "../../hooks/useAuth";
import { Header } from "./Header";
import axios from "../../libs/utils/api";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { auth } = useAuth();

  const [bio, setBio] = useState("");
  const [trips, setTrips] = useState([]);
  const [experiences, setExperiences] = useState<any[]>([]);
  const navigate = useNavigate();

  const scrollRef = useRef<HTMLDivElement>(null);

  console.log("AUTH: ", auth)

  useEffect(() => {
  if (auth?.bio) {
    setBio(auth.bio);
  }
}, [auth]);
  

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await axios.get(
          "/trips/get",
          {}
        );

        setTrips(res.data.trips || []);
      } catch (err) {
        console.error("Failed to load trips:", err);
      }
    };

    fetchTrips();
  }, []);

    useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await axios.get("/experience/get", {});
        setExperiences(res.data.experience || []);
      } catch (err) {
        console.error("Failed to load experiences:", err);
      }
    };

    fetchExperiences();
  }, []);

  const scrollAmount = 320;

  const next = () => {
    scrollRef.current?.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    });
  };

  const prev = () => {
    scrollRef.current?.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    });
  };


  return (
    <div>
      <Header home={true} />

      <div className="profile-page">
        {/* HERO */}
        <div className="profile-hero">
          <div className="profile-avatar">
            {auth?.photo_url ? (
              <img src={auth.photo_url}
                onLoad={() => console.log("Image loaded")}
  onError={(e) => console.log("Image failed", e)}
              />
            ) : (
              <div className="fallback">
                {auth?.username?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div className="profile-info">
            <h2>{auth?.username}</h2>
            <p>{auth?.email}</p>

            <div className="profile-bio">
              <input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Write a short bio..."
              />

              {/* {!isSaved && bio.trim() !== "" && (
                <button onClick={() => setIsSaved(true)}>
                  Save Bio
                </button>
              )} */}
            </div>
          </div>
        </div>

        {/* EXPERIENCE FEED */}
    <div className="profile-section">
          <h3>Travel Experiences</h3>
          <p className="muted">
            Stories shared by travelers about their journeys, routes, and discoveries  
          </p>

          <div className="post-feed">
            {experiences.length === 0 ? (
                <div className="empty-experience">
    <p className="muted">No experiences yet</p>

    <button
      className="post-experience-btn"
      onClick={() => {
        navigate("/profile/create")

        console.log("Create Experience");
      }}
    >
      Share Your First Travel Experience
    </button>
  </div>
            ) : (
              experiences.map((exp) => (
                <div key={exp.id} className="post-card">

                  {/* USER HEADER */}
                  <div className="post-header">
                    

                   
                  </div>

                  {/* EXPERIENCE DETAILS */}
                  <h4>{exp.title}</h4>

                  <p className="post-text">
                    {exp.review}
                  </p>

                  <p className="muted">
                    {exp.from} → {exp.to}
                  </p>

                  <p className="muted">
                    Transport: {exp.transport} | Budget: ${exp.budget}
                  </p>

                  <p className="muted">
                    ⭐ Rating: {exp.rating}/5
                  </p>

                  <p className="muted">
                        {new Date(exp.created_at).toLocaleString()}
                      </p>

                  {exp.image && (
                    <img
                      className="post-image"
                      src={exp.image}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* SAVED ROUTES CAROUSEL */}
        <div className="profile-section">
          <h3>Saved Routes</h3>
          <p className="muted">Your most recent planned trips</p>

          <div className="carousel-wrapper">
            <button className="arrow left" onClick={prev}>
              ◀
            </button>

            <div className="carousel-scroll" ref={scrollRef}>
              {trips.length === 0 ? (
                <p className="muted">No trips saved yet</p>
              ) : (
                trips.map((trip: any) => (
                  <div className="card" key={trip._id}>
                    <h4>
                      {trip.from} → {trip.to}
                    </h4>

                    <p>Budget: ${trip.budget}</p>

                    {trip.distance && (
                      <p>Distance: {trip.distance}</p>
                    )}

                    {trip.duration && (
                      <p>Duration: {trip.duration}</p>
                    )}

                    {trip.selected_transport && (
                      <p>
                        Transport: {trip.selected_transport}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>

            <button className="arrow right" onClick={next}>
              ▶
            </button>
          </div>
        </div>
                  {/* SAVED SEARCHES */}
      <div className="profile-section">
        <h3>Saved Searches</h3>
        <p className="muted">Quick access to your frequent queries</p>

        <div className="tag-list">
          <span className="tag">Cheap flights to NYC</span>
          <span className="tag">Best weekend trips</span>
          <span className="tag">Europe budget travel</span>
        </div>
      </div>

      {/* SETTINGS */}
      <div className="profile-section">
        <h3>Preferences</h3>

        <div className="settings-grid">
          <div className="setting-card">
            <p>Currency</p>
            <strong>USD</strong>
          </div>

          <div className="setting-card">
            <p>Travel Style</p>
            <strong>Budget + Comfort</strong>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};