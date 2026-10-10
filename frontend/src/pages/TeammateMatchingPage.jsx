import React, { useState, useEffect } from "react";
import api from "../services/api";
import { ScoreBadge } from "../components/ScoreBadge";
import { Alert } from "../components/Alert";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Modal } from "../components/Modal";
import { Link } from "react-router-dom";

export const TeammateMatchingPage = () => {
  const [matches, setMatches] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [minScore, setMinScore] = useState(0);

  // Invite Modal state
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [selectedTeamId, setSelectedTeamId] = useState("");
  const [sendingInvite, setSendingInvite] = useState(false);

  useEffect(() => {
    fetchMatchesAndTeams();
  }, []);

  const fetchMatchesAndTeams = async () => {
    try {
      setLoading(true);
      setError(null);

      const [matchesRes, teamsRes] = await Promise.all([
        api.get("/student/matches"),
        api.get("/student/teams"),
      ]);

      setMatches(matchesRes.data || []);
      setMyTeams(teamsRes.data || []);
    } catch (err) {
      if (err.response?.status === 404) {
        setError("Please complete your profile first to view teammate matches.");
      } else {
        setError(
          err.response?.data?.message || "Failed to load matching candidates."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOpenInviteModal = (candidate) => {
    setSelectedCandidate(candidate);
    if (myTeams.length > 0) {
      setSelectedTeamId(myTeams[0].id.toString());
    }
  };

  const handleSendInvite = async (e) => {
    e.preventDefault();
    if (!selectedTeamId || !selectedCandidate) return;

    try {
      setSendingInvite(true);
      await api.post("/student/invitations", {
        teamId: Number(selectedTeamId),
        receiverId: selectedCandidate.userId,
      });

      setSuccess(`Invitation successfully sent to ${selectedCandidate.name}!`);
      setSelectedCandidate(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not send invitation. They may already be in the team or have a pending invite."
      );
    } finally {
      setSendingInvite(false);
    }
  };

  const parseTags = (str) =>
    str
      ? str
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

  const filteredMatches = matches.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      m.name?.toLowerCase().includes(q) ||
      m.skills?.toLowerCase().includes(q) ||
      m.interests?.toLowerCase().includes(q);

    const matchesRole =
      roleFilter === "ALL" ||
      m.preferredRole?.toLowerCase().includes(roleFilter.toLowerCase());

    const matchesScore = m.compatibilityScore >= minScore;

    return matchesSearch && matchesRole && matchesScore;
  });

  if (loading) return <LoadingSpinner text="Calculating optimal teammates..." />;

  return (
    <div className="container page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Synergy Teammate Finder</h1>
          <p className="page-subtitle">
            AI-driven compatibility ranking based on complementary skills,
            shared interests, and diverse team roles.
          </p>
        </div>
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

      {matches.length === 0 && !error && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No matching candidates found yet</h3>
          <p>
            Make sure your profile is filled out with your core technical skills
            and interests.
          </p>
          <Link to="/student/profile" className="btn btn-primary">
            Edit Profile →
          </Link>
        </div>
      )}

      {matches.length > 0 && (
        <>
          {/* Filters Bar */}
          <div className="filters-card">
            <div className="filter-item">
              <label className="form-label">Search by Skill or Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. React, Python, Docker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="filter-item">
              <label className="form-label">Filter by Preferred Role</label>
              <select
                className="form-select"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="ALL">All Roles</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Fullstack">Fullstack</option>
                <option value="AI / ML">AI / ML</option>
                <option value="UI / UX">UI / UX Designer</option>
                <option value="Mobile">Mobile</option>
              </select>
            </div>

            <div className="filter-item">
              <label className="form-label">
                Min Compatibility ({minScore}%)
              </label>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="range-input"
              />
            </div>
          </div>

          <div className="results-count">
            Showing <strong>{filteredMatches.length}</strong> compatible candidates
          </div>

          {/* Matches Grid */}
          <div className="matches-grid">
            {filteredMatches.map((m) => (
              <div key={m.userId} className="match-card">
                <div className="match-card-top">
                  <div className="match-avatar-info">
                    <span className="user-avatar-lg">
                      {m.name ? m.name.charAt(0).toUpperCase() : "U"}
                    </span>
                    <div>
                      <h3 className="match-name">{m.name}</h3>
                      <div className="match-meta-badges">
                        <span className="badge badge-purple">
                          {m.preferredRole || "Hacker"}
                        </span>
                        <span className="badge badge-blue">
                          {m.experience || "Intermediate"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <ScoreBadge
                    score={m.compatibilityScore}
                    breakdown={m.scoreBreakdown}
                  />
                </div>

                <div className="match-section">
                  <div className="section-label">Skills & Tech Stack</div>
                  <div className="tag-cloud">
                    {parseTags(m.skills).map((skill, idx) => (
                      <span key={idx} className="chip chip-skill">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="match-section">
                  <div className="section-label">Areas of Interest</div>
                  <div className="tag-cloud">
                    {parseTags(m.interests).map((interest, idx) => (
                      <span key={idx} className="chip chip-interest">
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="match-card-actions">
                  <button
                    className="btn btn-primary btn-block"
                    onClick={() => handleOpenInviteModal(m)}
                  >
                    + Invite to Team
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Invite Modal */}
      <Modal
        isOpen={!!selectedCandidate}
        onClose={() => setSelectedCandidate(null)}
        title={`Invite ${selectedCandidate?.name} to Team`}
      >
        {myTeams.length === 0 ? (
          <div className="modal-empty-notice">
            <p>
              You haven't created any teams yet. Create a team first to invite
              members.
            </p>
            <Link to="/student/teams" className="btn btn-primary">
              Create a Team Now →
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSendInvite} className="form-layout">
            <div className="form-group">
              <label className="form-label" htmlFor="selectTeam">
                Select Your Team
              </label>
              <select
                id="selectTeam"
                className="form-select"
                value={selectedTeamId}
                onChange={(e) => setSelectedTeamId(e.target.value)}
                required
              >
                {myTeams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name} ({team.hackathonTitle})
                  </option>
                ))}
              </select>
            </div>

            <div className="modal-candidate-summary">
              <strong>Invitee:</strong> {selectedCandidate?.name} (
              {selectedCandidate?.preferredRole})
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-outline"
                onClick={() => setSelectedCandidate(null)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={sendingInvite}
              >
                {sendingInvite ? "Sending..." : "Send Invitation"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
