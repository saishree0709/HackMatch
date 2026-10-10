package com.hackmatch.backend.controller;

import com.hackmatch.backend.dto.HackathonRequest;
import com.hackmatch.backend.dto.HackathonResponse;
import com.hackmatch.backend.dto.ProblemStatementResponse;
import com.hackmatch.backend.dto.TeamResponse;
import com.hackmatch.backend.entity.*;
import com.hackmatch.backend.exception.ForbiddenException;
import com.hackmatch.backend.exception.ResourceNotFoundException;
import com.hackmatch.backend.repository.HackathonRepository;
import com.hackmatch.backend.repository.ProblemStatementRepository;
import com.hackmatch.backend.service.TeamService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/organizer/hackathons")
public class OrganizerHackathonController {

    private final HackathonRepository hackathonRepository;
    private final ProblemStatementRepository problemRepository;
    private final TeamService teamService;

    public OrganizerHackathonController(
            HackathonRepository hackathonRepository,
            ProblemStatementRepository problemRepository,
            TeamService teamService) {
        this.hackathonRepository = hackathonRepository;
        this.problemRepository = problemRepository;
        this.teamService = teamService;
    }

    @PostMapping
    public ResponseEntity<HackathonResponse> createHackathon(
            @Valid @RequestBody HackathonRequest request,
            Authentication authentication) {

        User organizer = (User) authentication.getPrincipal();

        Hackathon hackathon = new Hackathon();
        hackathon.setTitle(request.getTitle());
        hackathon.setDescription(request.getDescription());
        hackathon.setStartDate(request.getStartDate());
        hackathon.setEndDate(request.getEndDate());
        hackathon.setLocation(request.getLocation());
        hackathon.setMode(request.getMode());
        hackathon.setOrganizer(organizer);

        Hackathon saved = hackathonRepository.save(hackathon);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(toResponse(saved));
    }

    @GetMapping
    public List<HackathonResponse> getMyHackathons(
            Authentication authentication) {

        User organizer = (User) authentication.getPrincipal();

        return hackathonRepository.findByOrganizer(organizer)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{hackathonId}")
    public HackathonResponse getHackathon(
            @PathVariable Long hackathonId,
            Authentication authentication) {

        User organizer = (User) authentication.getPrincipal();

        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hackathon not found"));

        if (!hackathon.getOrganizer().getId().equals(organizer.getId())) {
            throw new ForbiddenException(
                    "You are not the owner of this hackathon");
        }

        return toResponse(hackathon);
    }

    @PutMapping("/{hackathonId}")
    public HackathonResponse updateHackathon(
            @PathVariable Long hackathonId,
            @Valid @RequestBody HackathonRequest request,
            Authentication authentication) {

        User organizer = (User) authentication.getPrincipal();

        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hackathon not found"));

        if (!hackathon.getOrganizer().getId().equals(organizer.getId())) {
            throw new ForbiddenException(
                    "You are not the owner of this hackathon");
        }

        hackathon.setTitle(request.getTitle());
        hackathon.setDescription(request.getDescription());
        hackathon.setStartDate(request.getStartDate());
        hackathon.setEndDate(request.getEndDate());
        hackathon.setLocation(request.getLocation());
        hackathon.setMode(request.getMode());

        return toResponse(hackathonRepository.save(hackathon));
    }

    @GetMapping("/{hackathonId}/problems")
    public List<ProblemStatementResponse> getHackathonProblems(
            @PathVariable Long hackathonId,
            Authentication authentication) {

        User organizer = (User) authentication.getPrincipal();

        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hackathon not found"));

        if (!hackathon.getOrganizer().getId().equals(organizer.getId())) {
            throw new ForbiddenException(
                    "You are not the owner of this hackathon");
        }

        return problemRepository.findByHackathon(hackathon)
                .stream()
                .map(this::toProblemResponse)
                .collect(Collectors.toList());
    }

    @GetMapping("/{hackathonId}/teams")
    public List<TeamResponse> getHackathonTeams(
            @PathVariable Long hackathonId,
            Authentication authentication) {

        User organizer = (User) authentication.getPrincipal();

        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hackathon not found"));

        if (!hackathon.getOrganizer().getId().equals(organizer.getId())) {
            throw new ForbiddenException(
                    "You are not the owner of this hackathon");
        }

        return teamService.getTeamsByHackathon(hackathonId);
    }

    @DeleteMapping("/{hackathonId}")
    public ResponseEntity<?> deleteHackathon(
            @PathVariable Long hackathonId,
            Authentication authentication) {

        User organizer = (User) authentication.getPrincipal();

        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hackathon not found"));

        if (!hackathon.getOrganizer().getId().equals(organizer.getId())) {
            throw new ForbiddenException(
                    "You are not the owner of this hackathon");
        }

        // Delete problem statements associated first
        List<ProblemStatement> problems = problemRepository.findByHackathon(hackathon);
        problemRepository.deleteAll(problems);

        hackathonRepository.delete(hackathon);
        return ResponseEntity.noContent().build();
    }

    private HackathonResponse toResponse(Hackathon h) {
        return new HackathonResponse(
                h.getId(),
                h.getTitle(),
                h.getDescription(),
                h.getStartDate(),
                h.getEndDate(),
                h.getLocation(),
                h.getMode(),
                h.getCreatedAt()
        );
    }

    private ProblemStatementResponse toProblemResponse(ProblemStatement ps) {
        return new ProblemStatementResponse(
                ps.getId(),
                ps.getTitle(),
                ps.getDescription(),
                ps.getRequiredSkills(),
                ps.getHackathon().getId()
        );
    }
}