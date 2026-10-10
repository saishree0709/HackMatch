package com.hackmatch.backend.dto;

public class ProblemStatementResponse {

    private Long id;
    private String title;
    private String description;
    private String requiredSkills;
    private Long hackathonId;

    public ProblemStatementResponse() {
    }

    public ProblemStatementResponse(
            Long id,
            String title,
            String description,
            String requiredSkills,
            Long hackathonId) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.requiredSkills = requiredSkills;
        this.hackathonId = hackathonId;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public Long getHackathonId() {
        return hackathonId;
    }
}