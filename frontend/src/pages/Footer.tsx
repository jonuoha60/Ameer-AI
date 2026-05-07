import React from "react";
import "../constants/styles/Footer.css";
import { Icons } from "../constants/styles/icons";

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
            <a href="/">
              <Icons.Globe />
            </a>

            <a href="/">
              <Icons.Users />
            </a>

            <a href="/">
              <Icons.Map />
            </a>
          </div>
        </div>

        {/* COMPANY */}
        <div className="footer-links">
          <h4>Company</h4>

          <a href="/">About</a>
          <a href="/">Careers</a>
          <a href="/">Blog</a>
          <a href="/">Press</a>
        </div>

        {/* PRODUCTS */}
        <div className="footer-links">
          <h4>Products</h4>

          <a href="/">Route Comparison</a>
          <a href="/">Budget Tracker</a>
          <a href="/">AI Planner</a>
          <a href="/">Trip History</a>
        </div>

        {/* SUPPORT */}
        <div className="footer-links">
          <h4>Support</h4>

          <a href="/">Help Center</a>
          <a href="/">Contact</a>
          <a href="/">Privacy Policy</a>
          <a href="/">Terms of Service</a>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Ameer AI. All rights reserved.</p>

        <div className="footer-bottom-links">
          <a href="/">Privacy</a>
          <a href="/">Terms</a>
          <a href="/">Accessibility</a>
        </div>
      </div>
    </footer>
  );
};