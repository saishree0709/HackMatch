import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Navbar = () => {
  const { user, isAuthenticated, logout, isStudent, isOrganizer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">
            Hack<span className="logo-highlight">Match</span>
          </span>
        </Link>

        <nav className="navbar-links">
          <Link
            to="/hackathons"
            className={`nav-link ${isActive("/hackathons") ? "active" : ""}`}
          >
            Explore Hackathons
          </Link>

          {isAuthenticated && isStudent && (
            <>
              <Link
                to="/student/dashboard"
                className={`nav-link ${isActive("/student/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link
                to="/student/matches"
                className={`nav-link ${isActive("/student/matches") ? "active" : ""}`}
              >
                Find Teammates
              </Link>
              <Link
                to="/student/teams"
                className={`nav-link ${isActive("/student/teams") ? "active" : ""}`}
              >
                My Teams
              </Link>
              <Link
                to="/student/invitations"
                className={`nav-link ${isActive("/student/invitations") ? "active" : ""}`}
              >
                Invitations
              </Link>
              <Link
                to="/student/profile"
                className={`nav-link ${isActive("/student/profile") ? "active" : ""}`}
              >
                My Profile
              </Link>
            </>
          )}

          {isAuthenticated && isOrganizer && (
            <>
              <Link
                to="/organizer/dashboard"
                className={`nav-link ${isActive("/organizer/dashboard") ? "active" : ""}`}
              >
                Organizer Dashboard
              </Link>
              <Link
                to="/organizer/hackathons/new"
                className={`nav-link ${isActive("/organizer/hackathons/new") ? "active" : ""}`}
              >
                + Host Hackathon
              </Link>
            </>
          )}
        </nav>

        <div className="navbar-actions">
          {isAuthenticated ? (
            <div className="user-menu">
              <div className="user-badge">
                <span className="user-avatar">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                </span>
                <div className="user-info">
                  <span className="user-name">{user?.name}</span>
                  <span className="user-role-tag">{user?.role}</span>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm"
                title="Sign out"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-outline btn-sm">
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
