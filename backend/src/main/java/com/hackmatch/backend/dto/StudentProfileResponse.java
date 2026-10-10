package com.hackmatch.backend.dto;

public class StudentProfileResponse {

    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private String skills;
    private String interests;
    private String experience;
    private String preferredRole;

    public StudentProfileResponse() {
    }

    public StudentProfileResponse(Long id, Long userId, String userName,
                                   String userEmail, String skills,
                                   String interests, String experience,
                                   String preferredRole) {
        this.id = id;
        this.userId = userId;
        this.userName = userName;
        this.userEmail = userEmail;
        this.skills = skills;
        this.interests = interests;
        this.experience = experience;
        this.preferredRole = preferredRole;
    }

    public Long getId() { return id; }
    public Long getUserId() { return userId; }
    public String getUserName() { return userName; }
    public String getUserEmail() { return userEmail; }
    public String getSkills() { return skills; }
    public String getInterests() { return interests; }
    public String getExperience() { return experience; }
    public String getPreferredRole() { return preferredRole; }
}
