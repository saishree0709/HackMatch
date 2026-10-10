import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ScoreBadge } from "../components/ScoreBadge";
import { Alert } from "../components/Alert";

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [teams, setTeams] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [topMatches, setTopMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Run parallel requests
      const [pRes, tRes, iRes, mRes] = await Promise.allSettled([
        api.get("/student/profile"),
        api.get("/student/teams"),
        api.get("/student/invitations/received"),
        api.get("/student/matches"),
      ]);

      if (pRes.status === "fulfilled") setProfile(pRes.value.data);
      if (tRes.status === "fulfilled") setTeams(tRes.value.data || []);
      if (iRes.status === "fulfilled") setInvitations(iRes.value.data || []);
      if (mRes.status === "fulfilled") setTopMatches((mRes.value.data || []).slice(0, 3));
    } catch {
      setError("Failed to load dashboard details.");
    } finally {
      setLoading(false);
    }
  };

  const pendingInvites = invitations.filter((i) => i.status === "PENDING");

  if (loading) return <LoadingSpinner text="Preparing your dashboard..." />;

  return (
    <div className="container page-content">
      {/* Welcome Hero Banner */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-info">
          <span className="badge badge-purple">Student Portal</span>
          <h1 className="welcome-title">Welcome back, {user?.name || "Hacker"}!</h1>
          <p className="welcome-text">
            {profile ? (
              <>
                Role: <strong>{profile.preferredRole}</strong> • Experience:{" "}
                <strong>{profile.experience}</strong>
              </>
            ) : (
              "Complete your skills profile to unlock tailored teammate suggestions."
            )}
          </p>
        </div>

        <div className="welcome-actions">
          <Link to="/student/matches" className="btn btn-primary">
            ⚡ Find Teammates
          </Link>
          <Link to="/student/profile" className="btn btn-outline">
            {profile ? "Edit Profile" : "Complete Profile"}
          </Link>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🛡️</div>
          <div className="metric-info">
            <span className="metric-value">{teams.length}</span>
            <span className="metric-label">Teams Joined</span>
          </div>
          <Link to="/student/teams" className="metric-link">
            View squads →
          </Link>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📬</div>
          <div className="metric-info">
            <span className="metric-value">{pendingInvites.length}</span>
            <span className="metric-label">Pending Invitations</span>
          </div>
          <Link to="/student/invitations" className="metric-link">
            Review invites →
          </Link>
        </div>

        <div className="metric-card">
          <div className="metric-icon">✨</div>
          <div className="metric-info">
            <span className="metric-value">
              {profile ? profile.skills.split(",").length : 0}
            </span>
            <span className="metric-label">Listed Skills</span>
          </div>
          <Link to="/student/profile" className="metric-link">
            Update skills →
          </Link>
        </div>
      </div>

      {/* Main Grid: My Teams & Recommended Teammates */}
      <div className="dashboard-sections-grid">
        {/* Left Column: My Active Teams */}
        <div className="dashboard-col">
          <div className="section-header-row">
            <h2 className="section-title">My Teams</h2>
            <Link to="/student/teams" className="text-link">
              See all ({teams.length})
            </Link>
          </div>

          {teams.length === 0 ? (
            <div className="card text-center py-4">
              <p className="text-muted">You haven't formed or joined a squad yet.</p>
              <div style={{ marginTop: "1rem" }}>
                <Link to="/hackathons" className="btn btn-primary btn-sm">
                  Explore Hackathons to Join
                </Link>
              </div>
            </div>
          ) : (
            <div className="dashboard-teams-list">
              {teams.slice(0, 3).map((t) => (
                <div key={t.id} className="dashboard-team-item">
                  <div>
                    <span className="badge badge-blue">{t.hackathonTitle}</span>
                    <h4 className="team-item-name">{t.name}</h4>
                    <span className="team-item-members">
                      👥 {t.members?.length || 1} squad members
                    </span>
                  </div>
                  <Link
                    to="/student/teams"
                    className="btn btn-outline btn-sm"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Top Compatible Matches */}
        <div className="dashboard-col">
          <div className="section-header-row">
            <h2 className="section-title">Top Synergistic Matches</h2>
            <Link to="/student/matches" className="text-link">
              View all matches
            </Link>
          </div>

          {!profile ? (
            <div className="card text-center py-4">
              <p className="text-muted">
                Create your hacker profile to calculate compatibility scores.
              </p>
              <div style={{ marginTop: "1rem" }}>
                <Link to="/student/profile" className="btn btn-primary btn-sm">
                  Setup Profile Now
                </Link>
              </div>
            </div>
          ) : topMatches.length === 0 ? (
            <div className="card text-center py-4">
              <p className="text-muted">No candidate recommendations right now.</p>
            </div>
          ) : (
            <div className="dashboard-matches-list">
              {topMatches.map((m) => (
                <div key={m.userId} className="dashboard-match-item">
                  <div className="match-item-left">
                    <span className="user-avatar">
                      {m.name ? m.name.charAt(0).toUpperCase() : "U"}
                    </span>
                    <div>
                      <h4 className="match-item-name">{m.name}</h4>
                      <span className="badge badge-purple">
                        {m.preferredRole}
                      </span>
                    </div>
                  </div>

                  <ScoreBadge score={m.compatibilityScore} />
                </div>
              ))}
              <div style={{ marginTop: "0.5rem" }}>
                <Link
                  to="/student/matches"
                  className="btn btn-outline btn-block btn-sm"
                >
                  Explore All Recommended Hackers →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
