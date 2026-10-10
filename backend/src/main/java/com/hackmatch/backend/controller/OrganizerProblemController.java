package com.hackmatch.backend.controller;

import com.hackmatch.backend.dto.ProblemStatementRequest;
import com.hackmatch.backend.dto.ProblemStatementResponse;
import com.hackmatch.backend.entity.Hackathon;
import com.hackmatch.backend.entity.ProblemStatement;
import com.hackmatch.backend.entity.User;
import com.hackmatch.backend.exception.ForbiddenException;
import com.hackmatch.backend.exception.ResourceNotFoundException;
import com.hackmatch.backend.repository.HackathonRepository;
import com.hackmatch.backend.repository.ProblemStatementRepository;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class OrganizerProblemController {

    private final HackathonRepository hackathonRepository;
    private final ProblemStatementRepository problemRepository;

    public OrganizerProblemController(
            HackathonRepository hackathonRepository,
            ProblemStatementRepository problemRepository) {

        this.hackathonRepository = hackathonRepository;
        this.problemRepository = problemRepository;
    }

    /**
     * Preserves original endpoint: POST /api/organizer/hackathons/{hackathonId}/problems
     */
    @PostMapping("/api/organizer/hackathons/{hackathonId}/problems")
    public ResponseEntity<ProblemStatementResponse> createProblemForHackathon(
            @PathVariable Long hackathonId,
            @Valid @RequestBody ProblemStatementRequest request,
            Authentication authentication) {

        User organizer = (User) authentication.getPrincipal();

        Hackathon hackathon = hackathonRepository
                .findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hackathon not found"));

        if (!hackathon.getOrganizer().getId().equals(organizer.getId())) {
            throw new ForbiddenException(
                    "You are not the owner of this hackathon");
        }

        ProblemStatement problem = new ProblemStatement();
        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setRequiredSkills(request.getRequiredSkills());
        problem.setHackathon(hackathon);

        ProblemStatement saved = problemRepository.save(problem);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(saved));
    }

    @GetMapping("/api/organizer/problems/{problemId}")
    public ProblemStatementResponse getProblem(
            @PathVariable Long problemId,
            Authentication authentication) {

        User organizer = (User) authentication.getPrincipal();

        ProblemStatement problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Problem statement not found"));

        if (!problem.getHackathon().getOrganizer().getId()
                .equals(organizer.getId())) {
            throw new ForbiddenException(
                    "You are not the owner of this hackathon");
        }

        return toResponse(problem);
    }

    @PutMapping("/api/organizer/problems/{problemId}")
    public ProblemStatementResponse updateProblem(
            @PathVariable Long problemId,
            @Valid @RequestBody ProblemStatementRequest request,
            Authentication authentication) {

        User organizer = (User) authentication.getPrincipal();

        ProblemStatement problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Problem statement not found"));

        if (!problem.getHackathon().getOrganizer().getId()
                .equals(organizer.getId())) {
            throw new ForbiddenException(
                    "You are not the owner of this hackathon");
        }

        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setRequiredSkills(request.getRequiredSkills());

        return toResponse(problemRepository.save(problem));
    }

    @DeleteMapping("/api/organizer/problems/{problemId}")
    public ResponseEntity<?> deleteProblem(
            @PathVariable Long problemId,
            Authentication authentication) {

        User organizer = (User) authentication.getPrincipal();

        ProblemStatement problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Problem statement not found"));

        if (!problem.getHackathon().getOrganizer().getId()
                .equals(organizer.getId())) {
            throw new ForbiddenException(
                    "You are not the owner of this hackathon");
        }

        problemRepository.delete(problem);
        return ResponseEntity.noContent().build();
    }

    private ProblemStatementResponse toResponse(ProblemStatement ps) {
        return new ProblemStatementResponse(
                ps.getId(),
                ps.getTitle(),
                ps.getDescription(),
                ps.getRequiredSkills(),
                ps.getHackathon().getId()
        );
    }
}