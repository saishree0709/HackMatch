package com.hackmatch.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_profiles")
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(length = 1000)
    private String skills;

    @Column(length = 1000)
    private String interests;

    @Column(length = 2000)
    private String experience;

    @Column(name = "preferred_role")
    private String preferredRole;

    public StudentProfile() {
    }

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
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

    public void setId(Long id) {
        this.id = id;
    }

    public void setUser(User user) {
        this.user = user;
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