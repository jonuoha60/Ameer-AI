// Signup.tsx
import React, { useState } from "react";
import { inputStyle, dividerStyle } from "../../constants/styles/icons/index";
import { GoogleIcon, GithubIcon } from "../../constants/styles/icons/index";
import { Header } from "./Header";
import axios from "../../components/api/api";

interface FocusedInputs {
  [key: string]: boolean;
}

export const Signup = () => {
  const [focused, setFocused] = useState<FocusedInputs>({});
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);
  const [error, setError] = useState<{
      email?: string;
      password?: string;
      username?: string;
      general?: string;
    }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(false);

  const handleFocus = (field: string) =>
    setFocused((p) => ({ ...p, [field]: true }));

  const handleBlur = (field: string) =>
    setFocused((p) => ({ ...p, [field]: false }));

  const getInputStyle = (field: string): React.CSSProperties => ({
    ...inputStyle,
    borderColor: focused[field] ? "#111" : "#e2e2e2",
    boxShadow: focused[field] ? "0 0 0 3px rgba(0,0,0,0.06)" : "none",
    background: focused[field] ? "#fff" : "#fafafa",
  });

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string; username?: string } = {};  

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (email && !/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!username) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters long";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }


    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const finalUsername = username.trim() || email.split("@")[0];
    const finalEmail = email.trim();
    const finalPassword = password.trim();
  

    try {
      setLoading(true);

      const res = await axios.post("/user/signup", {
          username: finalUsername,
          email: finalEmail,
          password: finalPassword
      });


      if (res.data) {
        setSuccessMessage("Account created successfully! You can now log in.");
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }

      setUsername("");
      setEmail("");
      setPassword("");
    }  catch (err: any) {
  console.error("Request failed:", err);

  if (err.response) {
    const message = err.response.data?.error || "Login failed";

    setError({
      general: message,
    });
  } else {
    setError({
      general: "Network error. Please try again.",
    });
  }
} finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header home={false} />

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Create an account</h1>
            <p className="auth-subtitle">Get started — it's free forever</p>
          </div>

          <div className="auth-oauth-row">
            {[
              { id: "google", label: "Google", icon: <GoogleIcon /> },
              { id: "github", label: "GitHub", icon: <GithubIcon /> },
            ].map(({ id, label, icon }) => (
              <button
                key={id}
                type="button"
                className="auth-oauth-btn"
                onMouseEnter={() => setHoveredBtn(id)}
                onMouseLeave={() => setHoveredBtn(null)}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </div>

          <div style={dividerStyle}>
            <div className="auth-divider-line" />
            <span className="auth-divider-label">or</span>
            <div className="auth-divider-line" />
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label className="auth-label">Username</label>
              <input
                type="text"
                placeholder="Alex Johnson"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={getInputStyle("username")}
                onFocus={() => handleFocus("username")}
                onBlur={() => handleBlur("username")}
              />
                            {error.username && <p className="auth-error">{error.username}</p>}

            </div>

            <div className="auth-field">
              <label className="auth-label">Email address</label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={getInputStyle("email")}
                onFocus={() => handleFocus("email")}
                onBlur={() => handleBlur("email")}
              />
            {error.email && <p className="auth-error">{error.email}</p>}

            </div>

            <div className="auth-field">
              <label className="auth-label">Password</label>
              <input
                type="password"
                placeholder="Min. 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={getInputStyle("password")}
                onFocus={() => handleFocus("password")}
                onBlur={() => handleBlur("password")}
              />
            {error.password && <p className="auth-error">{error.password}</p>}
            </div>

            {error.general && (
            <p className="auth-error">
              {error.general}
            </p>
          )}

              {successMessage && (
                <p className="auth-success">{successMessage}</p>
              )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
              onMouseEnter={() => setHoveredBtn("submit")}
              onMouseLeave={() => setHoveredBtn(null)}
            >
              {loading ? "Creating..." : "Create account"}
            </button>
          </form>

          <p className="auth-toggle">
            Already have an account?{" "}
            <a href="/login" className="auth-toggle-btn">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </>
  );
};