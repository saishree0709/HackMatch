package com.hackmatch.backend.controller;

import com.hackmatch.backend.dto.HackathonResponse;
import com.hackmatch.backend.dto.ProblemStatementResponse;
import com.hackmatch.backend.entity.Hackathon;
import com.hackmatch.backend.entity.ProblemStatement;
import com.hackmatch.backend.exception.ResourceNotFoundException;
import com.hackmatch.backend.repository.HackathonRepository;
import com.hackmatch.backend.repository.ProblemStatementRepository;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hackathons")
public class HackathonController {

    private final HackathonRepository hackathonRepository;
    private final ProblemStatementRepository problemRepository;

    public HackathonController(
            HackathonRepository hackathonRepository,
            ProblemStatementRepository problemRepository) {

        this.hackathonRepository = hackathonRepository;
        this.problemRepository = problemRepository;
    }

    @GetMapping
    public List<HackathonResponse> getAllHackathons() {

        return hackathonRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{hackathonId}")
    public HackathonResponse getHackathon(
            @PathVariable Long hackathonId) {

        Hackathon hackathon = hackathonRepository.findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hackathon not found"));

        return toResponse(hackathon);
    }

    @GetMapping("/{hackathonId}/problems")
    public List<ProblemStatementResponse> getProblems(
            @PathVariable Long hackathonId) {

        Hackathon hackathon = hackathonRepository
                .findById(hackathonId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hackathon not found"));

        return problemRepository.findByHackathon(hackathon)
                .stream()
                .map(this::toProblemResponse)
                .collect(Collectors.toList());
    }

    private HackathonResponse toResponse(Hackathon hackathon) {

        return new HackathonResponse(
                hackathon.getId(),
                hackathon.getTitle(),
                hackathon.getDescription(),
                hackathon.getStartDate(),
                hackathon.getEndDate(),
                hackathon.getLocation(),
                hackathon.getMode(),
                hackathon.getCreatedAt()
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