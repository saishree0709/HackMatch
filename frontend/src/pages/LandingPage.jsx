import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const LandingPage = () => {
  const { isAuthenticated, isStudent, isOrganizer } = useAuth();

  const getDashboardLink = () => {
    if (isOrganizer) return "/organizer/dashboard";
    return "/student/dashboard";
  };

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-badge">
          <span>🚀 Smart Skill-Based Team Formation Platform</span>
        </div>
        <h1 className="hero-title">
          Build Winning <span className="gradient-text">Hackathon Teams</span>{" "}
          with Algorithmic Synergy
        </h1>
        <p className="hero-subtitle">
          Say goodbye to random teammate grouping. HackMatch calculates skill
          complementarity, shared interests, and role diversity to pair you
          with teammates who maximize your odds of victory.
        </p>

        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to={getDashboardLink()} className="btn btn-primary btn-lg">
              Go to Your Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                Join HackMatch Free →
              </Link>
              <Link to="/hackathons" className="btn btn-outline btn-lg">
                Explore Hackathons
              </Link>
            </>
          )}
        </div>

        {/* Feature Highlights Banner */}
        <div className="hero-stats">
          <div className="stat-card">
            <div className="stat-value">100%</div>
            <div className="stat-desc">Explainable Compatibility Scores</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">4 Factors</div>
            <div className="stat-desc">Skills, Interests, Roles, & Experience</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">Instant</div>
            <div className="stat-desc">Team Invitations & Member Roster</div>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="features-section">
        <div className="section-header">
          <h2 className="section-title">Built for Hackers & Organizers</h2>
          <p className="section-subtitle">
            Everything you need from profile discovery to team submission.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🧠</div>
            <h3 className="feature-title">Complementary Skill Matching</h3>
            <p className="feature-text">
              Our matching engine evaluates what skills you bring and pairs you
              with hackers who have complementary capabilities—so you never end up
              with four frontend developers and no backend lead.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3 className="feature-title">Problem Statement Alignment</h3>
            <p className="feature-text">
              Browse organizers' official problem statements, understand
              required technical stacks, and form targeted teams around specific
              hackathon challenges.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3 className="feature-title">Frictionless Team Invitations</h3>
            <p className="feature-text">
              Send invitations to recommended hackers with one click. Manage
              pending requests, accept team invitations, and manage your full
              roster seamlessly.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🏆</div>
            <h3 className="feature-title">Organizer Control Center</h3>
            <p className="feature-text">
              Hackathon hosts can publish hackathons, craft rich problem
              statements, and monitor live team formations and participant rosters.
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="steps-section">
        <div className="section-header">
          <h2 className="section-title">How HackMatch Works</h2>
          <p className="section-subtitle">Three simple steps to your dream team.</p>
        </div>

        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <h4 className="step-title">Create Your Tech Profile</h4>
            <p className="step-desc">
              List your core programming languages, frameworks, interests, and
              desired role (e.g. Backend, Frontend, ML).
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <h4 className="step-title">Discover Matches & Scores</h4>
            <p className="step-desc">
              View ranked teammate recommendations with transparent 0-100%
              compatibility ratings and detailed score breakdowns.
            </p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <h4 className="step-title">Form Teams & Build</h4>
            <p className="step-desc">
              Send invites, confirm your team, link your problem statement, and
              start building your winning submission.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="cta-section">
        <h2>Ready to build something extraordinary?</h2>
        <p>Find your ideal hackathon squad today.</p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Get Started Now →
        </Link>
      </section>
    </div>
  );
};
