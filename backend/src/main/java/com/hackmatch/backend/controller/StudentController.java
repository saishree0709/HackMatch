package com.hackmatch.backend.controller;

import com.hackmatch.backend.dto.*;
import com.hackmatch.backend.entity.User;
import com.hackmatch.backend.service.InvitationService;
import com.hackmatch.backend.service.MatchingService;
import com.hackmatch.backend.service.TeamService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student")
public class StudentController {

    private final TeamService teamService;
    private final InvitationService invitationService;
    private final MatchingService matchingService;

    public StudentController(TeamService teamService,
                              InvitationService invitationService,
                              MatchingService matchingService) {
        this.teamService = teamService;
        this.invitationService = invitationService;
        this.matchingService = matchingService;
    }

    // ── Teams ──

    @PostMapping("/teams")
    public ResponseEntity<TeamResponse> createTeam(
            @Valid @RequestBody TeamRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        TeamResponse team = teamService.createTeam(request, user);
        return ResponseEntity.status(HttpStatus.CREATED).body(team);
    }

    @GetMapping("/teams")
    public List<TeamResponse> getMyTeams(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return teamService.getMyTeams(user);
    }

    @GetMapping("/teams/{teamId}")
    public TeamResponse getTeam(@PathVariable Long teamId) {
        return teamService.getTeamById(teamId);
    }

    // ── Invitations ──

    @PostMapping("/invitations")
    public ResponseEntity<InvitationResponse> sendInvitation(
            @Valid @RequestBody InvitationRequest request,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        InvitationResponse inv = invitationService.sendInvitation(
                request.getTeamId(), request.getReceiverId(), user);
        return ResponseEntity.status(HttpStatus.CREATED).body(inv);
    }

    @GetMapping("/invitations/received")
    public List<InvitationResponse> getReceivedInvitations(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return invitationService.getReceivedInvitations(user);
    }

    @GetMapping("/invitations/sent")
    public List<InvitationResponse> getSentInvitations(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return invitationService.getSentInvitations(user);
    }

    @PutMapping("/invitations/{invitationId}/accept")
    public InvitationResponse acceptInvitation(
            @PathVariable Long invitationId,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return invitationService.acceptInvitation(invitationId, user);
    }

    @PutMapping("/invitations/{invitationId}/reject")
    public InvitationResponse rejectInvitation(
            @PathVariable Long invitationId,
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return invitationService.rejectInvitation(invitationId, user);
    }

    // ── Matching ──

    @GetMapping("/matches")
    public List<MatchResponse> getMatches(
            Authentication authentication) {

        User user = (User) authentication.getPrincipal();
        return matchingService.findMatches(user);
    }
}