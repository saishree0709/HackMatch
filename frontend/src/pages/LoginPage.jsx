import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/Alert";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated, isStudent, isOrganizer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If already logged in, redirect to appropriate dashboard
    if (isAuthenticated) {
      if (isStudent) navigate("/student/dashboard", { replace: true });
      else if (isOrganizer) navigate("/organizer/dashboard", { replace: true });
      else navigate("/", { replace: true });
    }

    const params = new URLSearchParams(location.search);
    if (params.get("expired")) {
      setError("Your session has expired. Please log in again.");
    }
  }, [isAuthenticated, isStudent, isOrganizer, navigate, location]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      const user = await login(email, password);
      if (user.role === "STUDENT") {
        navigate("/student/dashboard");
      } else if (user.role === "ORGANIZER") {
        navigate("/organizer/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Invalid email or password. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🔐</div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your HackMatch account</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="you@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{" "}
            <Link to="/register" className="auth-link">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
