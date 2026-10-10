package com.hackmatch.backend.controller;

import com.hackmatch.backend.dto.StudentProfileRequest;
import com.hackmatch.backend.dto.StudentProfileResponse;
import com.hackmatch.backend.entity.StudentProfile;
import com.hackmatch.backend.entity.User;
import com.hackmatch.backend.exception.BadRequestException;
import com.hackmatch.backend.exception.ResourceNotFoundException;
import com.hackmatch.backend.repository.StudentProfileRepository;
import com.hackmatch.backend.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student/profile")
public class StudentProfileController {

    private final StudentProfileRepository profileRepository;
    private final UserRepository userRepository;

    public StudentProfileController(
            StudentProfileRepository profileRepository,
            UserRepository userRepository) {
        this.profileRepository = profileRepository;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<StudentProfileResponse> createProfile(
            @Valid @RequestBody StudentProfileRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        if (profileRepository.existsByUser(user)) {
            throw new BadRequestException("Profile already exists");
        }

        StudentProfile profile = new StudentProfile();
        profile.setUser(user);
        profile.setSkills(request.getSkills());
        profile.setInterests(request.getInterests());
        profile.setExperience(request.getExperience());
        profile.setPreferredRole(request.getPreferredRole());

        StudentProfile saved = profileRepository.save(profile);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(saved));
    }

    @PutMapping
    public ResponseEntity<StudentProfileResponse> updateProfile(
            @Valid @RequestBody StudentProfileRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Profile not found. Create one first."));

        profile.setSkills(request.getSkills());
        profile.setInterests(request.getInterests());
        profile.setExperience(request.getExperience());
        profile.setPreferredRole(request.getPreferredRole());

        StudentProfile saved = profileRepository.save(profile);

        return ResponseEntity.ok(toResponse(saved));
    }

    @GetMapping
    public ResponseEntity<StudentProfileResponse> getProfile(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Profile not found"));

        return ResponseEntity.ok(toResponse(profile));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<StudentProfileResponse> getProfileByUserId(
            @PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found"));

        StudentProfile profile = profileRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Profile not found for user: " + user.getName()));

        return ResponseEntity.ok(toResponse(profile));
    }

    private StudentProfileResponse toResponse(StudentProfile p) {
        return new StudentProfileResponse(
                p.getId(),
                p.getUser().getId(),
                p.getUser().getName(),
                p.getUser().getEmail(),
                p.getSkills(),
                p.getInterests(),
                p.getExperience(),
                p.getPreferredRole()
        );
    }
}