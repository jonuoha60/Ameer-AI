import { useState } from "react";
import "../../constants/styles/Explore.css";
import { Header } from "./Header";

export const Explore = () => {
  const [following, setFollowing] = useState<string[]>([]);

  const posts = [
    {
      _id: "1",
      userId: "u1",
      username: "Ameer Travels",
      userPhoto: "",
      image:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
      review:
        "Amazing trip to Paris! The Eiffel Tower at night was insane. Budget-friendly and smooth experience.",
      trip: { from: "London", to: "Paris" },
    },
    {
      _id: "2",
      userId: "u2",
      username: "Sarah Explorer",
      userPhoto: "",
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828",
      review:
        "Tokyo was a dream. Clean, fast transport and incredible food everywhere.",
      trip: { from: "Toronto", to: "Tokyo" },
    },
    {
      _id: "3",
      userId: "u3",
      username: "Mike Adventures",
      userPhoto: "",
      image:
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      review:
        "Hiking in Switzerland was life-changing. Mountains are unreal.",
      trip: { from: "Berlin", to: "Zurich" },
    },
  ];

  const suggestedUsers = [
    { id: "u4", name: "Travel With Anna" },
    { id: "u5", name: "Budget Nomad" },
    { id: "u6", name: "City Hopper" },
    { id: "u7", name: "Wander Labs" },
  ];

  const toggleFollow = (id: string) => {
    setFollowing((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  return (
    <div>
      <Header home={true} />
    <div className="explore-page">

      {/* FEED */}
      <div className="explore-feed">
        <h2>Explore Experiences</h2>

        {posts.map((post) => (
          <div className="explore-card" key={post._id}>

            {/* USER HEADER */}
            <div className="explore-user">
              <div className="fallback">
                {post.username.charAt(0)}
              </div>

              <div>
                <strong>{post.username}</strong>
                <p className="muted">
                  {post.trip.from} → {post.trip.to}
                </p>
              </div>

              <button
                className="follow-btn"
                onClick={() => toggleFollow(post.userId)}
              >
                {following.includes(post.userId)
                  ? "Following"
                  : "Follow"}
              </button>
            </div>

            {/* IMAGE */}
            <img
              className="explore-image"
              src={post.image}
              alt="trip"
            />

            {/* REVIEW */}
            <p className="explore-text">{post.review}</p>
          </div>
        ))}
      </div>

      {/* SIDEBAR */}
      <div className="explore-sidebar">
        <h3>People to Follow</h3>

        {suggestedUsers.map((user) => (
          <div className="suggest-user" key={user.id}>

            <div className="suggest-left">
              <div className="fallback">
                {user.name.charAt(0)}
              </div>

              <span>{user.name}</span>
            </div>

            <button
              className="mini-follow"
              onClick={() => toggleFollow(user.id)}
            >
              {following.includes(user.id)
                ? "Following"
                : "Follow"}
            </button>
          </div>
        ))}
      </div>

    </div>
    </div>
  );
};