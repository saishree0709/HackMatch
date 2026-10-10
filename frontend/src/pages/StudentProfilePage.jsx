import React, { useState, useEffect } from "react";
import api from "../services/api";
import { Alert } from "../components/Alert";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { useLocation } from "react-router-dom";

export const StudentProfilePage = () => {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [experience, setExperience] = useState("Intermediate");
  const [preferredRole, setPreferredRole] = useState("Fullstack");
  const [isExisting, setIsExisting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    fetchProfile();
    const params = new URLSearchParams(location.search);
    if (params.get("new")) {
      setMessage({
        type: "info",
        text: "Welcome! Complete your profile so our matching engine can pair you with top teammates.",
      });
    }
  }, [location]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get("/student/profile");
      if (res.data) {
        setSkills(res.data.skills || "");
        setInterests(res.data.interests || "");
        setExperience(res.data.experience || "Intermediate");
        setPreferredRole(res.data.preferredRole || "Fullstack");
        setIsExisting(true);
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setIsExisting(false);
      } else {
        setError("Failed to fetch profile details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!skills.trim()) {
      setError("Please list at least one skill.");
      return;
    }
    if (!interests.trim()) {
      setError("Please list at least one interest or domain.");
      return;
    }

    try {
      setSaving(true);
      const payload = {
        skills: skills.trim(),
        interests: interests.trim(),
        experience,
        preferredRole,
      };

      if (isExisting) {
        await api.put("/student/profile", payload);
        setMessage({ type: "success", text: "Profile updated successfully!" });
      } else {
        await api.post("/student/profile", payload);
        setIsExisting(true);
        setMessage({
          type: "success",
          text: "Profile created! You can now browse teammate recommendations.",
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not save profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const parseTags = (str) =>
    str
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  if (loading) return <LoadingSpinner text="Loading your profile..." />;

  return (
    <div className="container page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {isExisting ? "Edit Hacker Profile" : "Create Hacker Profile"}
          </h1>
          <p className="page-subtitle">
            Your skills and preferences power our algorithmic matching engine.
          </p>
        </div>
      </div>

      {message && (
        <Alert
          type={message.type}
          message={message.text}
          onClose={() => setMessage(null)}
        />
      )}
      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      <div className="profile-grid">
        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="form-layout">
            <div className="form-group">
              <label className="form-label" htmlFor="skills">
                Technical Skills (comma-separated)
              </label>
              <input
                id="skills"
                type="text"
                className="form-input"
                placeholder="React, Java, Spring Boot, Python, Docker"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                required
              />
              <span className="form-help">
                Include languages, frameworks, databases, and dev tools.
              </span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="interests">
                Interests & Domains (comma-separated)
              </label>
              <input
                id="interests"
                type="text"
                className="form-input"
                placeholder="Artificial Intelligence, FinTech, Web3, Healthcare, IoT"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                required
              />
              <span className="form-help">
                Themes or problem areas you're excited to hack on.
              </span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="preferredRole">
                  Preferred Role
                </label>
                <select
                  id="preferredRole"
                  className="form-select"
                  value={preferredRole}
                  onChange={(e) => setPreferredRole(e.target.value)}
                >
                  <option value="Frontend">Frontend Developer</option>
                  <option value="Backend">Backend Developer</option>
                  <option value="Fullstack">Fullstack Engineer</option>
                  <option value="AI / ML Engineer">AI / ML Engineer</option>
                  <option value="Mobile Developer">Mobile Developer (iOS/Android)</option>
                  <option value="UI / UX Designer">UI / UX Designer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="DevOps / Cloud">DevOps / Cloud Engineer</option>
                  <option value="Product / Pitch Lead">Product / Pitch Lead</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="experience">
                  Experience Level
                </label>
                <select
                  id="experience"
                  className="form-select"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                >
                  <option value="Beginner">Beginner (1st Hackathon / &lt;1 yr)</option>
                  <option value="Intermediate">Intermediate (1-2 Hackathons / 1-2 yrs)</option>
                  <option value="Advanced">Advanced (3+ Hackathons / 3+ yrs)</option>
                  <option value="Senior / Expert">Senior / Seasoned Competitor</option>
                </select>
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : isExisting
                  ? "Save Changes"
                  : "Create Profile →"}
              </button>
            </div>
          </form>
        </div>

        {/* Live Preview Card */}
        <div className="profile-preview-card">
          <div className="preview-header">
            <span className="preview-badge">Live Profile Preview</span>
            <h3>How teammates see you</h3>
          </div>

          <div className="preview-body">
            <div className="preview-field">
              <span className="field-label">Preferred Role</span>
              <span className="badge badge-purple">{preferredRole || "Not selected"}</span>
            </div>

            <div className="preview-field">
              <span className="field-label">Experience</span>
              <span className="badge badge-blue">{experience || "Not selected"}</span>
            </div>

            <div className="preview-field">
              <span className="field-label">Skills</span>
              <div className="tag-cloud">
                {parseTags(skills).length > 0 ? (
                  parseTags(skills).map((tag, i) => (
                    <span key={i} className="chip chip-skill">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">No skills listed yet</span>
                )}
              </div>
            </div>

            <div className="preview-field">
              <span className="field-label">Interests</span>
              <div className="tag-cloud">
                {parseTags(interests).length > 0 ? (
                  parseTags(interests).map((tag, i) => (
                    <span key={i} className="chip chip-interest">
                      {tag}
                    </span>
                  ))
                ) : (
                  <span className="text-muted">No interests listed yet</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
