package com.hackmatch.backend.dto;

import com.hackmatch.backend.entity.InvitationStatus;
import java.time.LocalDateTime;

public class InvitationResponse {

    private Long id;
    private Long teamId;
    private String teamName;
    private Long hackathonId;
    private String hackathonTitle;
    private Long senderId;
    private String senderName;
    private Long receiverId;
    private String receiverName;
    private InvitationStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public InvitationResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTeamId() { return teamId; }
    public void setTeamId(Long teamId) { this.teamId = teamId; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public Long getHackathonId() { return hackathonId; }
    public void setHackathonId(Long hackathonId) { this.hackathonId = hackathonId; }

    public String getHackathonTitle() { return hackathonTitle; }
    public void setHackathonTitle(String hackathonTitle) { this.hackathonTitle = hackathonTitle; }

    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public Long getReceiverId() { return receiverId; }
    public void setReceiverId(Long receiverId) { this.receiverId = receiverId; }

    public String getReceiverName() { return receiverName; }
    public void setReceiverName(String receiverName) { this.receiverName = receiverName; }

    public InvitationStatus getStatus() { return status; }
    public void setStatus(InvitationStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
