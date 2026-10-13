import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Alert } from "../components/Alert";
import { Modal } from "../components/Modal";

export const OrganizerHackathonManage = () => {
  const { hackathonId } = useParams();

  const [hackathon, setHackathon] = useState(null);
  const [problems, setProblems] = useState([]);
  const [teams, setTeams] = useState([]);
  const [activeTab, setActiveTab] = useState("problems"); // "problems", "teams", "edit"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Edit Hackathon Form State
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStart, setEditStart] = useState("");
  const [editEnd, setEditEnd] = useState("");
  const [editLoc, setEditLoc] = useState("");
  const [editMode, setEditMode] = useState("Online");
  const [savingHackathon, setSavingHackathon] = useState(false);

  // Problem Modal State (Create / Edit)
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [editingProblemId, setEditingProblemId] = useState(null);
  const [probTitle, setProbTitle] = useState("");
  const [probDesc, setProbDesc] = useState("");
  const [probSkills, setProbSkills] = useState("");
  const [savingProblem, setSavingProblem] = useState(false);

  useEffect(() => {
    fetchHackathonData();
  }, [hackathonId]);

  const fetchHackathonData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [hRes, pRes, tRes] = await Promise.all([
        api.get(`/organizer/hackathons/${hackathonId}`),
        api.get(`/organizer/hackathons/${hackathonId}/problems`),
        api.get(`/organizer/hackathons/${hackathonId}/teams`),
      ]);

      const h = hRes.data;
      setHackathon(h);
      setProblems(pRes.data || []);
      setTeams(tRes.data || []);

      setEditTitle(h.title || "");
      setEditDesc(h.description || "");
      setEditStart(h.startDate || "");
      setEditEnd(h.endDate || "");
      setEditLoc(h.location || "");
      setEditMode(h.mode || "Online");
    } catch {
      setError("Failed to load hackathon management details.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateHackathon = async (e) => {
    e.preventDefault();
    try {
      setSavingHackathon(true);
      await api.put(`/organizer/hackathons/${hackathonId}`, {
        title: editTitle.trim(),
        description: editDesc.trim(),
        startDate: editStart,
        endDate: editEnd,
        location: editLoc.trim(),
        mode: editMode,
      });

      setSuccess("Hackathon settings updated successfully!");
      fetchHackathonData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update hackathon.");
    } finally {
      setSavingHackathon(false);
    }
  };

  const handleOpenCreateProblem = () => {
    setEditingProblemId(null);
    setProbTitle("");
    setProbDesc("");
    setProbSkills("");
    setIsProblemModalOpen(true);
  };

  const handleOpenEditProblem = (p) => {
    setEditingProblemId(p.id);
    setProbTitle(p.title);
    setProbDesc(p.description);
    setProbSkills(p.requiredSkills || "");
    setIsProblemModalOpen(true);
  };

  const handleSaveProblem = async (e) => {
    e.preventDefault();
    if (!probTitle.trim() || !probDesc.trim()) return;

    try {
      setSavingProblem(true);
      const payload = {
        title: probTitle.trim(),
        description: probDesc.trim(),
        requiredSkills: probSkills.trim(),
      };

      if (editingProblemId) {
        await api.put(`/organizer/problems/${editingProblemId}`, payload);
        setSuccess("Problem statement updated!");
      } else {
        await api.post(`/organizer/hackathons/${hackathonId}/problems`, payload);
        setSuccess("Problem statement published!");
      }

      setIsProblemModalOpen(false);
      fetchHackathonData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save problem statement."
      );
    } finally {
      setSavingProblem(false);
    }
  };

  const handleDeleteProblem = async (problemId, name) => {
    if (!window.confirm(`Delete problem statement "${name}"?`)) return;

    try {
      await api.delete(`/organizer/problems/${problemId}`);
      setSuccess(`Problem "${name}" deleted.`);
      fetchHackathonData();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not delete problem statement."
      );
    }
  };

  const parseTags = (str) =>
    str
      ? str
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
      : [];

  const totalParticipants = teams.reduce(
    (acc, t) => acc + (t.members?.length || 0),
    0
  );

  if (loading) return <LoadingSpinner text="Loading hackathon console..." />;
  if (!hackathon) return <div className="container">Hackathon not found.</div>;

  return (
    <div className="container page-content">
      <Link to="/organizer/dashboard" className="back-link">
        ← Back to Organizer Dashboard
      </Link>

      <div className="page-header">
        <div>
          <span className="badge badge-purple">{hackathon.mode}</span>
          <h1 className="page-title">{hackathon.title}</h1>
          <p className="page-subtitle">
            Organizer Administration Panel • Manage problem statements, teams, and settings.
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

      {/* Tabs */}
      <div className="tabs-container">
        <button
          className={`tab-btn ${activeTab === "problems" ? "active" : ""}`}
          onClick={() => setActiveTab("problems")}
        >
          Track & Problems ({problems.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "teams" ? "active" : ""}`}
          onClick={() => setActiveTab("teams")}
        >
          Squads & Participants ({teams.length})
        </button>
        <button
          className={`tab-btn ${activeTab === "edit" ? "active" : ""}`}
          onClick={() => setActiveTab("edit")}
        >
          Event Details & Settings
        </button>
      </div>

      {/* Problems Tab */}
      {activeTab === "problems" && (
        <div className="tab-pane">
          <div className="section-header-row mb-4">
            <div>
              <h2 className="section-title">Problem Statements & Challenge Tracks</h2>
              <p className="section-subtitle">
                Hackers select from these tracks to focus their project submissions.
              </p>
            </div>
            <button
              className="btn btn-primary"
              onClick={handleOpenCreateProblem}
            >
              + Add Problem Statement
            </button>
          </div>

          {problems.length === 0 ? (
            <div className="card text-center py-5">
              <div className="empty-icon">📝</div>
              <h3>No problem statements added yet</h3>
              <p>Add challenge tracks so participants can form targeted teams.</p>
              <button
                className="btn btn-primary mt-3"
                onClick={handleOpenCreateProblem}
              >
                + Add Problem Statement
              </button>
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
                    <span className="field-label">Required Tech Skills:</span>
                    <div className="tag-cloud">
                      {parseTags(p.requiredSkills).length > 0 ? (
                        parseTags(p.requiredSkills).map((s, i) => (
                          <span key={i} className="chip chip-skill">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted">None specified</span>
                      )}
                    </div>
                  </div>

                  <div className="problem-card-footer">
                    <button
                      className="btn btn-outline btn-sm"
                      onClick={() => handleOpenEditProblem(p)}
                    >
                      ✏️ Edit
                    </button>
                    <button
                      className="btn btn-outline btn-sm text-danger"
                      onClick={() => handleDeleteProblem(p.id, p.title)}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Teams & Participants Tab */}
      {activeTab === "teams" && (
        <div className="tab-pane">
          <div className="section-header-row mb-4">
            <div>
              <h2 className="section-title">Registered Squads & Hackers</h2>
              <p className="section-subtitle">
                Total Teams: <strong>{teams.length}</strong> • Total
                Participants: <strong>{totalParticipants}</strong>
              </p>
            </div>
          </div>

          {teams.length === 0 ? (
            <div className="card text-center py-5">
              <div className="empty-icon">👥</div>
              <h3>No teams formed yet</h3>
              <p>
                As students create teams for this hackathon, they will appear
                here with full member rosters.
              </p>
            </div>
          ) : (
            <div className="teams-grid">
              {teams.map((t) => (
                <div key={t.id} className="team-card">
                  <div className="team-card-header">
                    <div>
                      <h3 className="team-name">{t.name}</h3>
                      <span className="text-muted text-sm">
                        Leader: <strong>{t.leaderName}</strong>
                      </span>
                    </div>
                    <span className="badge badge-purple">
                      {t.members?.length || 0} Members
                    </span>
                  </div>

                  {t.problemStatementTitle && (
                    <div className="team-track-info">
                      <span className="track-label">Target Track:</span>
                      <span className="track-title">
                        🎯 {t.problemStatementTitle}
                      </span>
                    </div>
                  )}

                  <div className="team-members-section">
                    <div className="members-header">
                      <h4>Roster</h4>
                    </div>
                    <div className="members-list">
                      {t.members?.map((m) => (
                        <div key={m.userId} className="member-item">
                          <div className="member-avatar">
                            {m.name ? m.name.charAt(0).toUpperCase() : "U"}
                          </div>
                          <div className="member-info">
                            <span className="member-name">{m.name}</span>
                            <span className="member-email">{m.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Event Settings Tab */}
      {activeTab === "edit" && (
        <div className="tab-pane">
          <div className="card max-w-2xl">
            <h2 className="section-title mb-4">Edit Hackathon Details</h2>

            <form onSubmit={handleUpdateHackathon} className="form-layout">
              <div className="form-group">
                <label className="form-label" htmlFor="editTitle">
                  Hackathon Title
                </label>
                <input
                  id="editTitle"
                  type="text"
                  className="form-input"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="editDesc">
                  Description
                </label>
                <textarea
                  id="editDesc"
                  className="form-textarea"
                  rows={4}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="editStart">
                    Start Date
                  </label>
                  <input
                    id="editStart"
                    type="date"
                    className="form-input"
                    value={editStart}
                    onChange={(e) => setEditStart(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="editEnd">
                    End Date
                  </label>
                  <input
                    id="editEnd"
                    type="date"
                    className="form-input"
                    value={editEnd}
                    onChange={(e) => setEditEnd(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="editMode">
                    Mode
                  </label>
                  <select
                    id="editMode"
                    className="form-select"
                    value={editMode}
                    onChange={(e) => setEditMode(e.target.value)}
                  >
                    <option value="Online">Online / Virtual</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="editLoc">
                    Location
                  </label>
                  <input
                    id="editLoc"
                    type="text"
                    className="form-input"
                    value={editLoc}
                    onChange={(e) => setEditLoc(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={savingHackathon}
                >
                  {savingHackathon ? "Saving..." : "Save Hackathon Settings"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Problem Modal */}
      <Modal
        isOpen={isProblemModalOpen}
        onClose={() => setIsProblemModalOpen(false)}
        title={
          editingProblemId
            ? "Edit Problem Statement"
            : "Add Problem Statement Track"
        }
      >
        <form onSubmit={handleSaveProblem} className="form-layout">
          <div className="form-group">
            <label className="form-label" htmlFor="probTitle">
              Track / Challenge Title
            </label>
            <input
              id="probTitle"
              type="text"
              className="form-input"
              placeholder="e.g. Healthcare AI Assistant"
              value={probTitle}
              onChange={(e) => setProbTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="probDesc">
              Challenge Description & Goals
            </label>
            <textarea
              id="probDesc"
              className="form-textarea"
              rows={4}
              placeholder="Describe the problem, target audience, evaluation criteria, and expected deliverables..."
              value={probDesc}
              onChange={(e) => setProbDesc(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="probSkills">
              Required / Recommended Skills (comma-separated)
            </label>
            <input
              id="probSkills"
              type="text"
              className="form-input"
              placeholder="Python, PyTorch, React, FastApi"
              value={probSkills}
              onChange={(e) => setProbSkills(e.target.value)}
            />
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => setIsProblemModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={savingProblem}
            >
              {savingProblem ? "Saving..." : "Save Track"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
