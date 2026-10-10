import React, { useState } from "react";

export const ScoreBadge = ({ score, breakdown }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = (val) => {
    if (val >= 80) return "score-high";
    if (val >= 60) return "score-medium";
    if (val >= 40) return "score-moderate";
    return "score-low";
  };

  const getLabel = (val) => {
    if (val >= 85) return "Exceptional Match";
    if (val >= 70) return "Strong Match";
    if (val >= 50) return "Good Fit";
    return "Complementary";
  };

  return (
    <div className="score-container">
      <div
        className={`score-badge ${getScoreColor(score)}`}
        onClick={() => breakdown && setShowDetails(!showDetails)}
        title="Click to view score breakdown"
      >
        <div className="score-number">{score}%</div>
        <div className="score-label">{getLabel(score)}</div>
        {breakdown && (
          <span className="score-toggle-icon">{showDetails ? "▲" : "▼"}</span>
        )}
      </div>

      {showDetails && breakdown && (
        <div className="score-breakdown-popover">
          <div className="breakdown-title">Compatibility Breakdown</div>
          <div className="breakdown-item">
            <div className="breakdown-header">
              <span>Skill Complementarity</span>
              <strong>{breakdown.skillComplementarity ?? 0} / 40</strong>
            </div>
            <div className="breakdown-progress-bg">
              <div
                className="breakdown-progress-fill"
                style={{
                  width: `${((breakdown.skillComplementarity ?? 0) / 40) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-header">
              <span>Shared Interests</span>
              <strong>{breakdown.interestOverlap ?? 0} / 25</strong>
            </div>
            <div className="breakdown-progress-bg">
              <div
                className="breakdown-progress-fill fill-blue"
                style={{
                  width: `${((breakdown.interestOverlap ?? 0) / 25) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-header">
              <span>Role Diversity</span>
              <strong>{breakdown.roleDiversity ?? 0} / 20</strong>
            </div>
            <div className="breakdown-progress-bg">
              <div
                className="breakdown-progress-fill fill-purple"
                style={{
                  width: `${((breakdown.roleDiversity ?? 0) / 20) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="breakdown-item">
            <div className="breakdown-header">
              <span>Experience Compatibility</span>
              <strong>{breakdown.experienceCompatibility ?? 0} / 15</strong>
            </div>
            <div className="breakdown-progress-bg">
              <div
                className="breakdown-progress-fill fill-amber"
                style={{
                  width: `${((breakdown.experienceCompatibility ?? 0) / 15) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
