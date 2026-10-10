package com.hackmatch.backend.dto;

import java.util.Map;

public class MatchResponse {

    private Long userId;
    private String name;
    private String email;
    private String skills;
    private String interests;
    private String experience;
    private String preferredRole;
    private int compatibilityScore;
    private Map<String, Integer> scoreBreakdown;

    public MatchResponse() {
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSkills() { return skills; }
    public void setSkills(String skills) { this.skills = skills; }

    public String getInterests() { return interests; }
    public void setInterests(String interests) { this.interests = interests; }

    public String getExperience() { return experience; }
    public void setExperience(String experience) { this.experience = experience; }

    public String getPreferredRole() { return preferredRole; }
    public void setPreferredRole(String preferredRole) { this.preferredRole = preferredRole; }

    public int getCompatibilityScore() { return compatibilityScore; }
    public void setCompatibilityScore(int compatibilityScore) { this.compatibilityScore = compatibilityScore; }

    public Map<String, Integer> getScoreBreakdown() { return scoreBreakdown; }
    public void setScoreBreakdown(Map<String, Integer> scoreBreakdown) { this.scoreBreakdown = scoreBreakdown; }
}
