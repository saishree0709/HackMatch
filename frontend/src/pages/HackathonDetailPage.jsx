import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Alert } from "../components/Alert";
import { Modal } from "../components/Modal";

export const HackathonDetailPage = () => {
  const { hackathonId } = useParams();
  const { isAuthenticated, isStudent } = useAuth();
  const navigate = useNavigate();

  const [hackathon, setHackathon] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Team creation modal state
  const [isTeamModalOpen, setIsTeamModalOpen] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [selectedProblemId, setSelectedProblemId] = useState("");
  const [creatingTeam, setCreatingTeam] = useState(false);

  useEffect(() => {
    fetchHackathonAndProblems();
  }, [hackathonId]);

  const fetchHackathonAndProblems = async () => {
    try {
      setLoading(true);
      const [hRes, pRes] = await Promise.all([
        api.get(`/hackathons/${hackathonId}`),
        api.get(`/hackathons/${hackathonId}/problems`),
      ]);
      setHackathon(hRes.data);
      setProblems(pRes.data || []);
    } catch (err) {
      setError("Failed to load hackathon details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) return;

    try {
      setCreatingTeam(true);
      const payload = {
        name: teamName.trim(),
        hackathonId: Number(hackathonId),
        problemStatementId: selectedProblemId ? Number(selectedProblemId) : null,
      };

      const res = await api.post("/student/teams", payload);
      setSuccess(`Team "${res.data.name}" created successfully!`);
      setIsTeamModalOpen(false);
      setTeamName("");
      setSelectedProblemId("");

      // Redirect to team management after short delay
      setTimeout(() => {
        navigate("/student/teams");
      }, 1000);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not create team. Make sure you don't already lead a team with this name."
      );
    } finally {
      setCreatingTeam(false);
    }
  };

  const parseTags = (str) =>
    str
      ? str
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0)
      : [];

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <LoadingSpinner text="Loading hackathon details..." />;
  if (!hackathon) return <div className="container">Hackathon not found.</div>;

  return (
    <div className="container page-content">
      {/* Back button */}
      <Link to="/hackathons" className="back-link">
        ← Back to Hackathons
      </Link>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}

      {/* Hackathon Hero Card */}
      <div className="hackathon-detail-header">
        <div className="detail-meta-top">
          <span className="badge badge-purple">{hackathon.mode}</span>
          <span className="detail-location">📍 {hackathon.location}</span>
          <span className="detail-dates">
            📅 {formatDate(hackathon.startDate)} – {formatDate(hackathon.endDate)}
          </span>
        </div>

        <h1 className="detail-title">{hackathon.title}</h1>
        <p className="detail-description">{hackathon.description}</p>

        <div className="detail-actions">
          {isAuthenticated && isStudent ? (
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setIsTeamModalOpen(true)}
            >
              + Create Team for this Hackathon
            </button>
          ) : !isAuthenticated ? (
            <Link to="/login" className="btn btn-primary btn-lg">
              Log in to Form a Team →
            </Link>
          ) : null}
        </div>
      </div>

      {/* Problem Statements Section */}
      <div className="detail-section">
        <div className="section-header-row">
          <div>
            <h2 className="section-title">Official Problem Statements</h2>
            <p className="section-subtitle">
              Choose a challenge that aligns with your squad's tech stack and vision.
            </p>
          </div>
          <span className="badge badge-blue">
            {problems.length} Challenges Available
          </span>
        </div>

        {problems.length === 0 ? (
          <div className="card text-center py-5">
            <p className="text-muted">
              The organizer has not published problem statements for this
              hackathon yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="problems-grid">
            {problems.map((p, idx) => (
              <div key={p.id} className="problem-card">
                <div className="problem-header">
                  <span className="problem-number">Track #{idx + 1}</span>
                  <h3 className="problem-title">{p.title}</h3>
                </div>
                <p className="problem-desc">{p.description}</p>

                <div className="problem-skills">
                  <span className="field-label">Required / Recommended Skills:</span>
                  <div className="tag-cloud">
                    {parseTags(p.requiredSkills).length > 0 ? (
                      parseTags(p.requiredSkills).map((skill, sIdx) => (
                        <span key={sIdx} className="chip chip-skill">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-muted">Open / All skills welcome</span>
                    )}
                  </div>
                </div>

                {isAuthenticated && isStudent && (
                  <div className="problem-card-footer">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => {
                        setSelectedProblemId(p.id.toString());
                        setIsTeamModalOpen(true);
                      }}
                    >
                      Create Team for This Track →
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal for Creating Team */}
      <Modal
        isOpen={isTeamModalOpen}
        onClose={() => setIsTeamModalOpen(false)}
        title={`Form Team for ${hackathon.title}`}
      >
        <form onSubmit={handleCreateTeam} className="form-layout">
          <div className="form-group">
            <label className="form-label" htmlFor="teamName">
              Team Name
            </label>
            <input
              id="teamName"
              type="text"
              className="form-input"
              placeholder="e.g. Neural Ninjas, CodeCrafters"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="problemStatement">
              Target Problem Statement (Optional)
            </label>
            <select
              id="problemStatement"
              className="form-select"
              value={selectedProblemId}
              onChange={(e) => setSelectedProblemId(e.target.value)}
            >
              <option value="">-- No track selected yet (decide later) --</option>
              {problems.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsTeamModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={creatingTeam}
            >
              {creatingTeam ? "Creating..." : "Confirm & Create Team"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
