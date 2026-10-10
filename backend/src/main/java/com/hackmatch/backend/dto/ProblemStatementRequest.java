package com.hackmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class ProblemStatementRequest {

    @NotBlank
    private String title;

    @NotBlank
    private String description;

    private String requiredSkills;

    public ProblemStatementRequest() {
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

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
}