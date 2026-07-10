import { Link } from "react-router-dom";
import "../../constants/styles/Footer.css";
import { Icons } from "../../constants/styles/icons";

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">

        {/* BRAND */}
        <div className="footer-brand">
          <h2>Ameer AI</h2>

          <p>
            Smarter travel planning with real-time routes,
            budget tracking, and AI-powered trip assistance.
          </p>

          <div className="footer-socials">
            <Link to="/"><Icons.Globe /></Link>
            <Link to="/"><Icons.Users /></Link>
            <Link to="/"><Icons.Map /></Link>
          </div>
        </div>

        {/* COMPANY */}
        <div className="footer-links">
          <h4>Company</h4>

          <Link to="/about">About</Link>

        </div>

        {/* PRODUCTS */}
        <div className="footer-links">
          <h4>Products</h4>

          <Link to="/route-comparison">Route Comparison</Link>
          <Link to="/budget-tracker">Budget Tracker</Link>
          <Link to="/ask-ameer">AI Planner</Link>
          <Link to="/profile">Trip History</Link>
        </div>

        {/* SUPPORT */}
        <div className="footer-links">
          <h4>Support</h4>

          <Link to="/help-center">Help Center</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/privacy-policy">Privacy Policy</Link>
          <Link to="/terms-of-service">Terms of Service</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Ameer AI. All rights reserved.</p>

        <div className="footer-bottom-links">
          <Link to="/privacy-policy">Privacy</Link>
          <Link to="/terms-of-service">Terms</Link>
        </div>
      </div>
    </footer>
  );
};