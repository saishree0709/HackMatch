package com.hackmatch.backend.dto;

import jakarta.validation.constraints.NotBlank;

public class StudentProfileRequest {

    @NotBlank
    private String skills;

    @NotBlank
    private String interests;

    private String experience;

    @NotBlank
    private String preferredRole;

    public StudentProfileRequest() {
    }

    public String getSkills() {
        return skills;
    }

    public String getInterests() {
        return interests;
    }

    public String getExperience() {
        return experience;
    }

    public String getPreferredRole() {
        return preferredRole;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public void setExperience(String experience) {
        this.experience = experience;
    }

    public void setPreferredRole(String preferredRole) {
        this.preferredRole = preferredRole;
    }
}