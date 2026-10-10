import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Alert } from "../components/Alert";

export const HackathonsPage = () => {
  const [hackathons, setHackathons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [search, setSearch] = useState("");
  const [modeFilter, setModeFilter] = useState("ALL");

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/hackathons");
      setHackathons(res.data || []);
    } catch (err) {
      setError("Failed to load hackathons. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredHackathons = hackathons.filter((h) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      h.title?.toLowerCase().includes(q) ||
      h.description?.toLowerCase().includes(q) ||
      h.location?.toLowerCase().includes(q);

    const matchMode =
      modeFilter === "ALL" ||
      h.mode?.toLowerCase() === modeFilter.toLowerCase();

    return matchSearch && matchMode;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "TBD";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) return <LoadingSpinner text="Discovering hackathons..." />;

  return (
    <div className="container page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Explore Hackathons</h1>
          <p className="page-subtitle">
            Find competitions, browse problem statements, and form your dream
            team.
          </p>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Filter and Search Bar */}
      <div className="filters-card">
        <div className="filter-item">
          <label className="form-label">Search Hackathons</label>
          <input
            type="text"
            className="form-input"
            placeholder="Search by title, description, or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-item">
          <label className="form-label">Event Format</label>
          <select
            className="form-select"
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
          >
            <option value="ALL">All Modes</option>
            <option value="Online">Online / Virtual</option>
            <option value="In-Person">In-Person</option>
            <option value="Hybrid">Hybrid</option>
          </select>
        </div>
      </div>

      {filteredHackathons.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h3>No hackathons match your search</h3>
          <p>Try resetting your search query or filters.</p>
        </div>
      ) : (
        <div className="hackathons-grid">
          {filteredHackathons.map((h) => (
            <div key={h.id} className="hackathon-card">
              <div className="hackathon-card-top">
                <span
                  className={`badge ${
                    h.mode?.toLowerCase() === "online"
                      ? "badge-blue"
                      : h.mode?.toLowerCase() === "hybrid"
                      ? "badge-purple"
                      : "badge-green"
                  }`}
                >
                  {h.mode || "Online"}
                </span>
                <span className="hackathon-location">📍 {h.location || "Virtual"}</span>
              </div>

              <h3 className="hackathon-title">{h.title}</h3>
              <p className="hackathon-desc">
                {h.description && h.description.length > 130
                  ? h.description.slice(0, 130) + "..."
                  : h.description}
              </p>

              <div className="hackathon-meta">
                <div className="meta-dates">
                  📅 {formatDate(h.startDate)} – {formatDate(h.endDate)}
                </div>
              </div>

              <div className="hackathon-card-bottom">
                <Link
                  to={`/hackathons/${h.id}`}
                  className="btn btn-outline btn-block"
                >
                  View Problems & Teams →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
