package com.hackmatch.backend.dto;

import jakarta.validation.constraints.NotNull;

public class InvitationRequest {

    @NotNull(message = "Team ID is required")
    private Long teamId;

    @NotNull(message = "Receiver user ID is required")
    private Long receiverId;

    public InvitationRequest() {
    }

    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }
}
