package com.hackmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TeamRequest {

    @NotBlank(message = "Team name is required")
    private String name;

    @NotNull(message = "Hackathon ID is required")
    private Long hackathonId;

    private Long problemStatementId;

    public TeamRequest() {
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getHackathonId() { return hackathonId; }
    public void setHackathonId(Long hackathonId) { this.hackathonId = hackathonId; }

    public Long getProblemStatementId() { return problemStatementId; }
    public void setProblemStatementId(Long problemStatementId) { this.problemStatementId = problemStatementId; }
}
