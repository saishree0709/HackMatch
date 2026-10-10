package com.hackmatch.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TeamResponse {

    private Long id;
    private String name;
    private Long hackathonId;
    private String hackathonTitle;
    private Long problemStatementId;
    private String problemStatementTitle;
    private Long leaderId;
    private String leaderName;
    private List<TeamMemberInfo> members;
    private LocalDateTime createdAt;

    public TeamResponse() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getHackathonId() { return hackathonId; }
    public void setHackathonId(Long hackathonId) { this.hackathonId = hackathonId; }

    public String getHackathonTitle() { return hackathonTitle; }
    public void setHackathonTitle(String hackathonTitle) { this.hackathonTitle = hackathonTitle; }

    public Long getProblemStatementId() { return problemStatementId; }
    public void setProblemStatementId(Long problemStatementId) { this.problemStatementId = problemStatementId; }

    public String getProblemStatementTitle() { return problemStatementTitle; }
    public void setProblemStatementTitle(String problemStatementTitle) { this.problemStatementTitle = problemStatementTitle; }

    public Long getLeaderId() { return leaderId; }
    public void setLeaderId(Long leaderId) { this.leaderId = leaderId; }

    public String getLeaderName() { return leaderName; }
    public void setLeaderName(String leaderName) { this.leaderName = leaderName; }

    public List<TeamMemberInfo> getMembers() { return members; }
    public void setMembers(List<TeamMemberInfo> members) { this.members = members; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class TeamMemberInfo {
        private Long userId;
        private String name;
        private String email;
        private LocalDateTime joinedAt;

        public TeamMemberInfo() {}

        public TeamMemberInfo(Long userId, String name, String email,
                              LocalDateTime joinedAt) {
            this.userId = userId;
            this.name = name;
            this.email = email;
            this.joinedAt = joinedAt;
        }

        public Long getUserId() { return userId; }
        public String getName() { return name; }
        public String getEmail() { return email; }
        public LocalDateTime getJoinedAt() { return joinedAt; }
    }
}
