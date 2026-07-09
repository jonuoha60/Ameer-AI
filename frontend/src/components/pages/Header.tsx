import { useState, useRef, useEffect } from "react";
import "../../constants/styles/Home.css";
import { LogoMark } from "../../constants/styles/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import axios from "../../libs/utils/api/index";
import { Menu, X } from "lucide-react";

interface Props {
  home: boolean;
}

export const Header = ({ home }: Props) => {
  const navigate = useNavigate();
  const { auth, isAuthenticated, logoutUser } = useAuth();
  const [mobileMenu, setMobileMenu] = useState(false);
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

  const logout = async () => {
    try {
      const res = await axios.post(`/user/logout`, {
      });

      if (res.status === 200) {
        await logoutUser();
        navigate("/login");
      } else {
        console.error("Logout failed");
      }
    } catch(err) {
      console.log("Logout error:", err);
    }
  }

  return (
  <nav className="navbar">

    <Link className="link" to="/">
      <div className="logo">
        <LogoMark /> Ameer AI
      </div>
    </Link>


    {home && (
      <div className={`nav-links ${mobileMenu ? "active" : ""}`}>
        <span onClick={() => navigate("/explore")}>
          Explore
        </span>

        <span onClick={() => navigate("/ask-ameer")}>
          Ask Ameer
        </span>

        <span onClick={() => navigate("/best-route/results")}>
          Budget
        </span>

        <span onClick={() => navigate("/about")}>
          About
        </span>
      </div>
    )}


    <div className="nav-actions">

      {isAuthenticated ? (
        <div className="profile-wrapper" ref={dropdownRef}>

          <div
            className="profile-container"
            onClick={() => setOpen(!open)}
          >
            {auth?.user.photo_url ? (
              <img
                src={auth.user.photo_url}
                className="profile-pic"
              />
            ) : (
              <div className="profile-initial">
                {auth?.user.username?.charAt(0).toUpperCase()}
              </div>
            )}

            <span className="profile-name">
              {auth?.user.username}
            </span>

          </div>


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
                onClick={logout}
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


      <button
        className="menu-btn"
        onClick={() => setMobileMenu(!mobileMenu)}
      >
        {mobileMenu ? <X size={24}/> : <Menu size={24}/>}
      </button>

    </div>

  </nav>
);
};