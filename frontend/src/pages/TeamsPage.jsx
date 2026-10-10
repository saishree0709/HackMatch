import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Alert } from "../components/Alert";
import { Modal } from "../components/Modal";

export const TeamsPage = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New Team Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [hackathonId, setHackathonId] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchTeamsAndHackathons();
  }, []);

  const fetchTeamsAndHackathons = async () => {
    try {
      setLoading(true);
      const [teamsRes, hRes] = await Promise.all([
        api.get("/student/teams"),
        api.get("/hackathons"),
      ]);
      setTeams(teamsRes.data || []);
      setHackathons(hRes.data || []);
      if (hRes.data?.length > 0) {
        setHackathonId(hRes.data[0].id.toString());
      }
    } catch (err) {
      setError("Failed to load your teams.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!name.trim() || !hackathonId) return;

    try {
      setCreating(true);
      await api.post("/student/teams", {
        name: name.trim(),
        hackathonId: Number(hackathonId),
      });

      setSuccess(`Team "${name}" created successfully!`);
      setName("");
      setIsModalOpen(false);
      // Refresh teams
      const teamsRes = await api.get("/student/teams");
      setTeams(teamsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not create team.");
    } finally {
      setCreating(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <LoadingSpinner text="Loading your teams..." />;

  return (
    <div className="container page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Teams</h1>
          <p className="page-subtitle">
            Manage your hackathon squads, view rosters, and recruit compatible hackers.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          + Create New Team
        </button>
      </div>

      {success && (
        <Alert
          type="success"
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {teams.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🛡️</div>
          <h3>You aren't in any teams yet</h3>
          <p>
            Form a team for an upcoming hackathon or wait for incoming teammate
            invitations.
          </p>
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              + Create Team Now
            </button>
            <Link to="/hackathons" className="btn btn-outline">
              Browse Hackathons
            </Link>
          </div>
        </div>
      ) : (
        <div className="teams-grid">
          {teams.map((t) => {
            const isLeader = t.leaderId === user?.id;

            return (
              <div key={t.id} className="team-card">
                <div className="team-card-header">
                  <div>
                    <span className="badge badge-blue">
                      {t.hackathonTitle}
                    </span>
                    <h3 className="team-name">{t.name}</h3>
                  </div>
                  {isLeader ? (
                    <span className="badge badge-gold">👑 Team Leader</span>
                  ) : (
                    <span className="badge badge-purple">Member</span>
                  )}
                </div>

                {t.problemStatementTitle && (
                  <div className="team-track-info">
                    <span className="track-label">Target Challenge:</span>
                    <span className="track-title">
                      🎯 {t.problemStatementTitle}
                    </span>
                  </div>
                )}

                {/* Team Members List */}
                <div className="team-members-section">
                  <div className="members-header">
                    <h4>Squad Roster ({t.members?.length || 0})</h4>
                  </div>

                  <div className="members-list">
                    {t.members?.map((m) => (
                      <div key={m.userId} className="member-item">
                        <div className="member-avatar">
                          {m.name ? m.name.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div className="member-info">
                          <span className="member-name">
                            {m.name}{" "}
                            {m.userId === t.leaderId && (
                              <span className="leader-tag">(Leader)</span>
                            )}
                          </span>
                          <span className="member-email">{m.email}</span>
                        </div>
                        <span className="member-joined">
                          Joined {formatDate(m.joinedAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="team-card-footer">
                  <Link
                    to="/student/matches"
                    className="btn btn-primary btn-block btn-sm"
                  >
                    + Find & Invite Teammates →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Team Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create a New Hackathon Squad"
      >
        <form onSubmit={handleCreateTeam} className="form-layout">
          <div className="form-group">
            <label className="form-label" htmlFor="newTeamName">
              Team Name
            </label>
            <input
              id="newTeamName"
              type="text"
              className="form-input"
              placeholder="e.g. Quantum Code, CyberKnights"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="newTeamHackathon">
              Select Hackathon
            </label>
            <select
              id="newTeamHackathon"
              className="form-select"
              value={hackathonId}
              onChange={(e) => setHackathonId(e.target.value)}
              required
            >
              {hackathons.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.title} ({h.mode} - {h.location})
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creating}
            >
              {creating ? "Creating..." : "Create Squad"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
