// Login.tsx
import { useState, type CSSProperties, type FormEvent } from "react";
import { inputStyle, dividerStyle } from "../../constants/styles/icons/index";
import { GoogleIcon, GithubIcon } from "../../constants/styles/icons/index";
import "../../constants/styles/Login.css";
import { Header } from "./Header";
import { useAuth } from "../../hooks/useAuth";
import axios from "../../libs/utils/api/index";
import { Link, useNavigate } from "react-router-dom";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase/client";

interface FocusedInputs {
  [key: string]: boolean;
}

export const Login = () => {
  const [focused, setFocused] = useState<FocusedInputs>({});
  const [error, setError] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});
  const { loginUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleFocus = (field: string) =>
    setFocused((p) => ({ ...p, [field]: true }));

  const handleBlur = (field: string) =>
    setFocused((p) => ({ ...p, [field]: false }));

  const getInputStyle = (field: string): CSSProperties => ({
    ...inputStyle,
    borderColor: focused[field] ? "#111" : "#e2e2e2",
    boxShadow: focused[field] ? "0 0 0 3px rgba(0,0,0,0.06)" : "none",
    background: focused[field] ? "#fff" : "#fafafa",
  });

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};  

    if (!email) {
      newErrors.email = "Email is required";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("/user/login", {
        email,
        password,
      }
    );

      const data = res.data;

      if(res.data) {
         loginUser(data.user); 
         navigate("/")
      }


    } catch (err: any) {
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


const handleGoogleSignIn = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);

    const user = result.user;
    const idToken = await user.getIdToken();

    const res = await axios.post("/user/google/login", {
      token: idToken,
    });

    loginUser(res.data.user);
    navigate("/");
  } catch(err: any) {
    console.error(err);
    console.error(err.response?.data);
  }
};

  return (
    <>
      <Header home={false} />

      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-header">
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">
              Sign in to continue to your trip
            </p>
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
                onClick={handleGoogleSignIn}
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
              <div className="auth-field-header">
                <label className="auth-label" style={{ margin: 0 }}>
                  Password
                </label>
                <button type="button" className="auth-forgot">
                  Forgot password?
                </button>
              </div>

              <input
                type="password"
                placeholder="••••••••"
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

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>

          <p className="auth-toggle">
            Don't have an account?{" "}
           <Link to="/signup" className="auth-toggle-btn">
  Sign up
</Link>
          </p>
        </div>
      </div>
    </>
  );
};