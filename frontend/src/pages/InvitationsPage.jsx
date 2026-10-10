import React, { useState, useEffect } from "react";
import api from "../services/api";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { Alert } from "../components/Alert";

export const InvitationsPage = () => {
  const [activeTab, setActiveTab] = useState("received");
  const [received, setReceived] = useState([]);
  const [sent, setSent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      setLoading(true);
      const [recRes, sentRes] = await Promise.all([
        api.get("/student/invitations/received"),
        api.get("/student/invitations/sent"),
      ]);
      setReceived(recRes.data || []);
      setSent(sentRes.data || []);
    } catch (err) {
      setError("Failed to load invitations.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (invitationId) => {
    try {
      setProcessingId(invitationId);
      await api.put(`/student/invitations/${invitationId}/accept`);
      setSuccess("You joined the team! Welcome aboard.");
      fetchInvitations();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not accept the invitation."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (invitationId) => {
    try {
      setProcessingId(invitationId);
      await api.put(`/student/invitations/${invitationId}/reject`);
      setSuccess("Invitation declined.");
      fetchInvitations();
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not decline the invitation."
      );
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    if (status === "ACCEPTED") return "badge-green";
    if (status === "REJECTED") return "badge-red";
    return "badge-gold";
  };

  if (loading) return <LoadingSpinner text="Checking your invitations..." />;

  const pendingReceivedCount = received.filter(
    (i) => i.status === "PENDING"
  ).length;

  return (
    <div className="container page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team Invitations</h1>
          <p className="page-subtitle">
            Manage incoming squad offers and track invitations you have sent to
            other hackers.
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
          className={`tab-btn ${activeTab === "received" ? "active" : ""}`}
          onClick={() => setActiveTab("received")}
        >
          Received Offers
          {pendingReceivedCount > 0 && (
            <span className="tab-counter">{pendingReceivedCount}</span>
          )}
        </button>
        <button
          className={`tab-btn ${activeTab === "sent" ? "active" : ""}`}
          onClick={() => setActiveTab("sent")}
        >
          Sent Invitations ({sent.length})
        </button>
      </div>

      {/* Received Tab */}
      {activeTab === "received" && (
        <div className="invitations-list">
          {received.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📬</div>
              <h3>No invitations received yet</h3>
              <p>
                Keep your profile updated with your skills so team leaders can
                reach out to you.
              </p>
            </div>
          ) : (
            received.map((inv) => (
              <div key={inv.id} className="invitation-card">
                <div className="invitation-main">
                  <div className="invitation-header-row">
                    <span className="badge badge-purple">
                      {inv.hackathonTitle}
                    </span>
                    <span className={`badge ${getStatusBadge(inv.status)}`}>
                      {inv.status}
                    </span>
                  </div>

                  <h3 className="invitation-team-name">{inv.teamName}</h3>
                  <p className="invitation-meta">
                    Invited by <strong>{inv.senderName}</strong> on{" "}
                    {formatDate(inv.createdAt)}
                  </p>
                </div>

                <div className="invitation-actions">
                  {inv.status === "PENDING" ? (
                    <>
                      <button
                        className="btn btn-primary btn-sm"
                        disabled={processingId === inv.id}
                        onClick={() => handleAccept(inv.id)}
                      >
                        {processingId === inv.id ? "Joining..." : "✓ Accept & Join"}
                      </button>
                      <button
                        className="btn btn-outline btn-sm"
                        disabled={processingId === inv.id}
                        onClick={() => handleReject(inv.id)}
                      >
                        ✕ Decline
                      </button>
                    </>
                  ) : (
                    <span className="text-muted text-sm">
                      Processed on {formatDate(inv.updatedAt || inv.createdAt)}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Sent Tab */}
      {activeTab === "sent" && (
        <div className="invitations-list">
          {sent.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📤</div>
              <h3>No invitations sent</h3>
              <p>
                Find complementary teammates and invite them directly to your
                team.
              </p>
            </div>
          ) : (
            sent.map((inv) => (
              <div key={inv.id} className="invitation-card">
                <div className="invitation-main">
                  <div className="invitation-header-row">
                    <span className="badge badge-purple">
                      {inv.hackathonTitle}
                    </span>
                    <span className={`badge ${getStatusBadge(inv.status)}`}>
                      {inv.status}
                    </span>
                  </div>

                  <h3 className="invitation-team-name">{inv.teamName}</h3>
                  <p className="invitation-meta">
                    Sent to <strong>{inv.receiverName}</strong> on{" "}
                    {formatDate(inv.createdAt)}
                  </p>
                </div>

                <div className="invitation-status-label">
                  {inv.status === "PENDING" && (
                    <span className="text-muted">Awaiting response</span>
                  )}
                  {inv.status === "ACCEPTED" && (
                    <span className="text-success font-medium">Joined team</span>
                  )}
                  {inv.status === "REJECTED" && (
                    <span className="text-danger font-medium">Declined</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
