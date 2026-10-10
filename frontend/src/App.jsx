import React from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Navbar } from "./components/Navbar";

// Pages
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HackathonsPage } from "./pages/HackathonsPage";
import { HackathonDetailPage } from "./pages/HackathonDetailPage";

// Student Pages
import { StudentDashboard } from "./pages/StudentDashboard";
import { StudentProfilePage } from "./pages/StudentProfilePage";
import { TeammateMatchingPage } from "./pages/TeammateMatchingPage";
import { TeamsPage } from "./pages/TeamsPage";
import { InvitationsPage } from "./pages/InvitationsPage";

// Organizer Pages
import { OrganizerDashboard } from "./pages/OrganizerDashboard";
import { CreateHackathonPage } from "./pages/CreateHackathonPage";
import { OrganizerHackathonManage } from "./pages/OrganizerHackathonManage";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-wrapper">
          <Navbar />

          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/hackathons" element={<HackathonsPage />} />
              <Route path="/hackathons/:hackathonId" element={<HackathonDetailPage />} />

              {/* Student Protected Routes */}
              <Route
                path="/student/dashboard"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/profile"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <StudentProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/matches"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <TeammateMatchingPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/teams"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <TeamsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/invitations"
                element={
                  <ProtectedRoute requiredRole="STUDENT">
                    <InvitationsPage />
                  </ProtectedRoute>
                }
              />

              {/* Organizer Protected Routes */}
              <Route
                path="/organizer/dashboard"
                element={
                  <ProtectedRoute requiredRole="ORGANIZER">
                    <OrganizerDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/hackathons/new"
                element={
                  <ProtectedRoute requiredRole="ORGANIZER">
                    <CreateHackathonPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/organizer/hackathons/:hackathonId/manage"
                element={
                  <ProtectedRoute requiredRole="ORGANIZER">
                    <OrganizerHackathonManage />
                  </ProtectedRoute>
                }
              />

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Global Footer */}
          <footer className="footer">
            <div className="footer-container">
              <div className="footer-brand">
                <div className="navbar-logo">
                  <span className="logo-icon">⚡</span>
                  <span className="logo-text">
                    Hack<span className="logo-highlight">Match</span>
                  </span>
                </div>
                <p className="footer-copy">
                  Algorithmic Synergy & Skill-Based Hackathon Team Formation Platform.
                </p>
              </div>

              <div className="footer-links">
                <Link to="/hackathons">Explore Hackathons</Link>
                <Link to="/login">Sign In</Link>
                <Link to="/register">Create Account</Link>
              </div>
            </div>
          </footer>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;