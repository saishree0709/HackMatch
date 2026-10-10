package com.hackmatch.backend.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class HackathonResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private String mode;
    private LocalDateTime createdAt;

    public HackathonResponse() {
    }

    public HackathonResponse(
            Long id,
            String title,
            String description,
            LocalDate startDate,
            LocalDate endDate,
            String location,
            String mode,
            LocalDateTime createdAt) {

        this.id = id;
        this.title = title;
        this.description = description;
        this.startDate = startDate;
        this.endDate = endDate;
        this.location = location;
        this.mode = mode;
        this.createdAt = createdAt;
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

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public String getLocation() {
        return location;
    }

    public String getMode() {
        return mode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}