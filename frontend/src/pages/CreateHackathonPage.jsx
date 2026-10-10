import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import { Alert } from "../components/Alert";

export const CreateHackathonPage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [mode, setMode] = useState("Online");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !startDate || !endDate) {
      setError("Please fill out all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await api.post("/organizer/hackathons", {
        title: title.trim(),
        description: description.trim(),
        startDate,
        endDate,
        location: location.trim() || "Virtual",
        mode,
      });

      // Navigate to the newly created hackathon management page to add problem statements
      navigate(`/organizer/hackathons/${res.data.id}/manage`);
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create hackathon. Please retry."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page-content">
      <Link to="/organizer/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <div className="page-header">
        <div>
          <h1 className="page-title">Host a New Hackathon</h1>
          <p className="page-subtitle">
            Publish an event, welcome global hackers, and assign challenge tracks.
          </p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit} className="form-layout">
          <div className="form-group">
            <label className="form-label" htmlFor="hTitle">
              Hackathon Title
            </label>
            <input
              id="hTitle"
              type="text"
              className="form-input"
              placeholder="e.g. NextGen Web3 & AI Hackathon"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="hDesc">
              Hackathon Description
            </label>
            <textarea
              id="hDesc"
              className="form-textarea"
              rows={4}
              placeholder="Overview of the event, eligibility, tech themes, and prize structure..."
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
                Format
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
                Location / Venue
              </label>
              <input
                id="hLocation"
                type="text"
                className="form-input"
                placeholder="e.g. San Francisco or Virtual"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Creating Hackathon..." : "Create & Add Problem Tracks →"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
