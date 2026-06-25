import { useState, useRef, useEffect } from "react";
import "../../constants/styles/Home.css";
import { LogoMark } from "../../constants/styles/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  home: boolean;
}

export const Header = ({ home }: Props) => {
  const navigate = useNavigate();
  const { auth, isAuthenticated } = useAuth();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="navbar">
      <Link className="link" to="/">
        <div className="logo">
          <LogoMark /> Ameer AI
        </div>
      </Link>

      {home && (
        <div className="nav-links">
          <span onClick={() => navigate("/explore")}>Explore</span>
          <span onClick={() => navigate("/ameer")}>Ask Ameer</span>
          <span onClick={() => navigate("/best-route/results")}>
            Budget
          </span>
          <span>About</span>
        </div>
      )}

      {isAuthenticated ? (
        <div className="profile-wrapper" ref={dropdownRef}>
          {/* PROFILE BUTTON */}
          <div
            className="profile-container"
            onClick={() => setOpen(!open)}
          >
            {auth?.photo_url ? (
              <img
                src={auth?.photo_url}
                className="profile-pic"
                
              />
            ) : (
              <div className="profile-initial">
                {auth?.username?.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="profile-name">{auth?.username}</span>
          </div>

          {/* DROPDOWN */}
          {open && (
            <div className="profile-dropdown">
              <div
                className="dropdown-item"
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
              >
                Profile
              </div>

              <div
                className="dropdown-item danger"
                onClick={() => {
                  setOpen(false);
                  navigate("/login");
                }}
              >
                Sign out
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="nav-btn"
        >
          Sign in
        </button>
      )}
    </nav>
  );
};