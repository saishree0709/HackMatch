package com.hackmatch.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "problem_statements")
public class ProblemStatement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 3000)
    private String description;

    @Column(length = 1000)
    private String requiredSkills;

    @ManyToOne
    @JoinColumn(name = "hackathon_id", nullable = false)
    private Hackathon hackathon;

    public ProblemStatement() {
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

    public Hackathon getHackathon() {
        return hackathon;
    }

    public void setId(Long id) {
        this.id = id;
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

    public void setHackathon(Hackathon hackathon) {
        this.hackathon = hackathon;
    }
}