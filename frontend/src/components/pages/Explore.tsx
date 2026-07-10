import { useEffect, useState } from "react";
import "../../constants/styles/Explore.css";
import { Header } from "./Header";
import axios from "../../libs/utils/api";
import { FaStar, FaRegStar } from "react-icons/fa";
import { FollowButton } from "../button/FollowButton";
import { useAuth } from "../../hooks/useAuth";

type Experience = {
  id: string;
  user_id: string;
  username?: string;
  userPhoto?: string;
  title: string;
  review: string;
  rating: number;
  from: string;
  to: string;
  transport: string;
  budget: number;
  image: string;
  likes: number;
  comments: number;
  created_at: string;
};

export const Explore = () => {
  const [following, setFollowing] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { auth } = useAuth()

  const [posts, setPosts] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const filters = [
    { id: "all", label: "All" },
    { id: "following", label: "Following" },
    { id: "popular", label: "Popular" },
    { id: "nearby", label: "Nearby" },
  ];

  const suggestedUsers = [
    { id: "u4", name: "Travel With Anna" },
    { id: "u5", name: "Budget Nomad" },
    { id: "u6", name: "City Hopper" },
    { id: "u7", name: "Wander Labs" },
  ];

  useEffect(() => {
    const fetchExperiences = async () => {
      setIsLoading(true);
      setLoadError(false);

      try {
        const res = await axios.get("/experience/discover");
        const experiences: Experience[] = res.data?.experience ?? [];

        setPosts(experiences);
        void hydrateUsernames(experiences);
      } catch (err) {
        console.error("Failed to load experiences:", err);
        setLoadError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  const hydrateUsernames = async (experiences: Experience[]) => {
    const uniqueUserIds = Array.from(
      new Set(experiences.map((post) => post.user_id))
    );

    const results = await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          const res = await axios.get(`/user/${userId}`);
          return { userId, user: res.data };
        } catch (err) {
          console.error(`Failed to load user ${userId}:`, err);
          return { userId, user: null };
        }
      })
    );

    const userMap = new Map(
      results.map(({ userId, user }) => [userId, user])
    );

    setPosts((prev) =>
      prev.map((post) => {
        const user = userMap.get(post.user_id);
        if (!user) return post;

        return {
          ...post,
          username: user.username ?? user.name ?? post.username,
          userPhoto: user.photo ?? user.userPhoto ?? post.userPhoto,
        };
      })
    );
  };

  const toggleFollow = (id: string) => {
    setFollowing((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const filteredPosts = posts.filter((post) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesQuery =
      !query ||
      (post.username ?? "").toLowerCase().includes(query) ||
      post.from.toLowerCase().includes(query) ||
      post.to.toLowerCase().includes(query);

    const matchesFilter =
      activeFilter === "all" ||
      (activeFilter === "following" && following.includes(post.user_id));
      // "popular" and "nearby" have no real data yet, so they fall through to true below

    const passesFilter =
      activeFilter === "popular" || activeFilter === "nearby"
        ? true
        : matchesFilter;

    return matchesQuery && passesFilter;
  });

  const renderStars = (rating: number) => {
  const rounded = Math.round(rating);

  return (
    <div className="rating-stars">
      {Array.from({ length: 5 }, (_, index) =>
        index < rounded ? (
          <FaStar key={index} className="star filled" />
        ) : (
          <FaRegStar key={index} className="star" />
        )
      )}
      <span className="rating-value">{rating.toFixed(1)}</span>
    </div>
  );
};

  return (
    <div>
      <Header home={true} />
    <div className="explore-page">

      {/* FEED */}
      <div className="explore-feed">

        {/* SEARCH BAR */}
        <div className="explore-search">
          <input
            type="text"
            placeholder="Search by user, city, or destination..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* SEARCH OPTIONS */}
        <div className="explore-filters">
          {filters.map((filter) => (
            <button
              key={filter.id}
              className={
                activeFilter === filter.id
                  ? "filter-chip active"
                  : "filter-chip"
              }
              onClick={() => setActiveFilter(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {isLoading && <p className="muted">Loading experiences...</p>}

        {!isLoading && loadError && (
          <p className="muted">
            Couldn't load experiences right now. Please try again later.
          </p>
        )}

        {!isLoading &&
          !loadError &&
          filteredPosts.map((post) => (
            <div className="explore-card" key={post.id}>

              {/* USER HEADER */}
              <div className="explore-user">
                {post.userPhoto ? (
                  <img
                    className="fallback avatar-img"
                    src={post.userPhoto}
                    alt={post.username ?? "Traveler"}
                  />
                ) : (
                  <div className="fallback">
                    {(post.username ?? "?").charAt(0)}
                  </div>
                )}

                <div>
                  <strong>{post.username ?? "Traveler"}</strong>
                  <p className="muted">
                    {post.from} → {post.to}
                  </p>
                  <p className="muted">
                    Budget: ${post.budget}
                  </p>
                  <p className="muted">
  {renderStars(post.rating)}
                  </p>
                </div>
<FollowButton auth={auth} followingId={post.user_id} />
              </div>

              {/* IMAGE */}
              {post.image && (
                <img
                  className="explore-image"
                  src={post.image}
                  alt="trip"
                />
              )}

              {/* REVIEW */}
              <p className="explore-text">{post.review}</p>
            </div>
          ))}

        {!isLoading && !loadError && filteredPosts.length === 0 && (
          <p className="muted">No trips match your search.</p>
        )}
      </div>

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