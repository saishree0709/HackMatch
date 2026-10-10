import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Alert } from "../components/Alert";

export const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("STUDENT");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please provide your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please provide a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      await register(name.trim(), email.trim(), password, role);

      // Auto-login upon successful registration
      const user = await login(email.trim(), password);
      if (user.role === "STUDENT") {
        navigate("/student/profile?new=true");
      } else {
        navigate("/organizer/dashboard");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please check your details and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-icon">🚀</div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join the HackMatch community</p>
        </div>

        {error && <Alert type="error" message={error} onClose={() => setError("")} />}

        <form onSubmit={handleSubmit} className="auth-form">
          {/* Role Selection */}
          <div className="form-group">
            <label className="form-label">I am joining as a:</label>
            <div className="role-selector">
              <label
                className={`role-option ${role === "STUDENT" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="STUDENT"
                  checked={role === "STUDENT"}
                  onChange={() => setRole("STUDENT")}
                />
                <span className="role-title">🎓 Student / Hacker</span>
                <span className="role-desc">
                  Find teammates, create teams, discover hackathons
                </span>
              </label>

              <label
                className={`role-option ${role === "ORGANIZER" ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="role"
                  value="ORGANIZER"
                  checked={role === "ORGANIZER"}
                  onChange={() => setRole("ORGANIZER")}
                />
                <span className="role-title">🏢 Hackathon Organizer</span>
                <span className="role-desc">
                  Host hackathons, set problem statements, manage teams
                </span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              className="form-input"
              placeholder="Alex Johnson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="alex@example.edu"
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
              placeholder="At least 6 characters"
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
            {loading ? "Creating Account..." : "Create Account →"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
