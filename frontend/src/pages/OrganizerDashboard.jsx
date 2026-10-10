import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Alert } from "../components/Alert";
import { Modal } from "../components/Modal";

export const OrganizerDashboard = () => {
  const { user } = useAuth();
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // New Hackathon Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("Online");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMyHackathons();
  }, []);

  const fetchMyHackathons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/organizer/hackathons");
      setHackathons(res.data || []);
    } catch {
      setError("Failed to load your hosted hackathons.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHackathon = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !startDate || !endDate) {
      setError("Please fill out all required hackathon fields.");
      return;
    }

    try {
      setSubmitting(true);
      await api.post("/organizer/hackathons", {
        title: title.trim(),
        description: description.trim(),
        startDate,
        endDate,
        location: location.trim() || "Virtual",
        mode,
      });

      setSuccess(`Hackathon "${title}" published successfully!`);
      setIsModalOpen(false);
      resetForm();
      fetchMyHackathons();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create hackathon. Please retry."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteHackathon = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await api.delete(`/organizer/hackathons/${id}`);
      setSuccess(`Hackathon "${name}" was deleted.`);
      fetchMyHackathons();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete hackathon.");
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartDate("");
    setEndDate("");
    setLocation("");
    setMode("Online");
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <LoadingSpinner text="Loading organizer center..." />;

  return (
    <div className="container page-content">
      {/* Organizer Header */}
      <div className="dashboard-welcome-banner">
        <div className="welcome-info">
          <span className="badge badge-gold">Organizer Portal</span>
          <h1 className="welcome-title">Organizer Control Center</h1>
          <p className="welcome-text">
            Logged in as <strong>{user?.name}</strong> • Manage hackathon
            challenges, evaluate incoming teams, and publish problem tracks.
          </p>
        </div>

        <div className="welcome-actions">
          <button
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            + Host New Hackathon
          </button>
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

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon">🏆</div>
          <div className="metric-info">
            <span className="metric-value">{hackathons.length}</span>
            <span className="metric-label">Hosted Hackathons</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">🚀</div>
          <div className="metric-info">
            <span className="metric-value">
              {hackathons.filter((h) => h.mode === "Online").length}
            </span>
            <span className="metric-label">Online Events</span>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon">📍</div>
          <div className="metric-info">
            <span className="metric-value">
              {hackathons.filter((h) => h.mode !== "Online").length}
            </span>
            <span className="metric-label">In-Person / Hybrid</span>
          </div>
        </div>
      </div>

      {/* Hackathons Table / Cards */}
      <div className="organizer-hackathons-section">
        <div className="section-header-row">
          <h2 className="section-title">Your Hosted Hackathons</h2>
          <span className="badge badge-blue">{hackathons.length} Total</span>
        </div>

        {hackathons.length === 0 ? (
          <div className="card text-center py-5">
            <div className="empty-icon">🎪</div>
            <h3>No hackathons published yet</h3>
            <p>
              Host your first hackathon to invite hackers and post problem
              statements.
            </p>
            <button
              className="btn btn-primary mt-3"
              onClick={() => setIsModalOpen(true)}
            >
              + Create Hackathon Now
            </button>
          </div>
        ) : (
          <div className="organizer-hackathons-grid">
            {hackathons.map((h) => (
              <div key={h.id} className="organizer-hackathon-card">
                <div className="card-top-row">
                  <span className="badge badge-purple">{h.mode}</span>
                  <span className="text-muted text-sm">
                    {formatDate(h.startDate)} – {formatDate(h.endDate)}
                  </span>
                </div>

                <h3 className="card-hackathon-title">{h.title}</h3>
                <p className="card-hackathon-desc">
                  {h.description && h.description.length > 120
                    ? h.description.slice(0, 120) + "..."
                    : h.description}
                </p>

                <div className="card-hackathon-location">
                  📍 {h.location || "Virtual"}
                </div>

                <div className="card-actions-row">
                  <Link
                    to={`/organizer/hackathons/${h.id}/manage`}
                    className="btn btn-primary btn-sm flex-1"
                  >
                    Manage Tracks & Teams →
                  </Link>
                  <button
                    onClick={() => handleDeleteHackathon(h.id, h.title)}
                    className="btn btn-outline btn-sm text-danger"
                    title="Delete Hackathon"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Hackathon Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Host a New Hackathon"
      >
        <form onSubmit={handleCreateHackathon} className="form-layout">
          <div className="form-group">
            <label className="form-label" htmlFor="hTitle">
              Hackathon Title
            </label>
            <input
              id="hTitle"
              type="text"
              className="form-input"
              placeholder="e.g. AI Synergy Global Hackathon 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="hDesc">
              Description & Theme
            </label>
            <textarea
              id="hDesc"
              className="form-textarea"
              rows={3}
              placeholder="Explain the hackathon purpose, prize pools, eligible participants..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="hStartDate">
                Start Date
              </label>
              <input
                id="hStartDate"
                type="date"
                className="form-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="hEndDate">
                End Date
              </label>
              <input
                id="hEndDate"
                type="date"
                className="form-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="hMode">
                Mode
              </label>
              <select
                id="hMode"
                className="form-select"
                value={mode}
                onChange={(e) => setMode(e.target.value)}
              >
                <option value="Online">Online / Virtual</option>
                <option value="In-Person">In-Person</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="hLocation">
                Location / Platform
              </label>
              <input
                id="hLocation"
                type="text"
                className="form-input"
                placeholder="e.g. Virtual (Discord) or Stanford Hall"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
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
              disabled={submitting}
            >
              {submitting ? "Publishing..." : "Publish Hackathon"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
