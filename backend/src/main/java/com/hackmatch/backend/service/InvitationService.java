package com.hackmatch.backend.service;

import com.hackmatch.backend.dto.InvitationResponse;
import com.hackmatch.backend.entity.*;
import com.hackmatch.backend.exception.*;
import com.hackmatch.backend.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class InvitationService {

    private final InvitationRepository invitationRepository;
    private final TeamRepository teamRepository;
    private final TeamMemberRepository memberRepository;
    private final UserRepository userRepository;

    public InvitationService(InvitationRepository invitationRepository,
                             TeamRepository teamRepository,
                             TeamMemberRepository memberRepository,
                             UserRepository userRepository) {
        this.invitationRepository = invitationRepository;
        this.teamRepository = teamRepository;
        this.memberRepository = memberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public InvitationResponse sendInvitation(Long teamId, Long receiverId,
                                              User sender) {

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Team not found"));

        // Only team leader can send invitations
        if (!team.getLeader().getId().equals(sender.getId())) {
            throw new ForbiddenException(
                    "Only the team leader can send invitations");
        }

        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "User not found"));

        // Can't invite yourself
        if (sender.getId().equals(receiverId)) {
            throw new BadRequestException("Cannot invite yourself");
        }

        // Check if already a member
        if (memberRepository.existsByTeamIdAndUserId(teamId, receiverId)) {
            throw new ConflictException(
                    "User is already a member of this team");
        }

        // Check for existing pending invitation
        if (invitationRepository.existsByTeamAndReceiverAndStatus(
                team, receiver, InvitationStatus.PENDING)) {
            throw new ConflictException(
                    "A pending invitation already exists for this user");
        }

        Invitation invitation = new Invitation();
        invitation.setTeam(team);
        invitation.setSender(sender);
        invitation.setReceiver(receiver);
        invitation.setStatus(InvitationStatus.PENDING);

        invitation = invitationRepository.save(invitation);

        return toResponse(invitation);
    }

    @Transactional
    public InvitationResponse acceptInvitation(Long invitationId, User user) {

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Invitation not found"));

        if (!invitation.getReceiver().getId().equals(user.getId())) {
            throw new ForbiddenException(
                    "You can only respond to your own invitations");
        }

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new BadRequestException(
                    "This invitation has already been " +
                            invitation.getStatus().name().toLowerCase());
        }

        invitation.setStatus(InvitationStatus.ACCEPTED);
        invitationRepository.save(invitation);

        // Add user to team
        if (!memberRepository.existsByTeamAndUser(
                invitation.getTeam(), user)) {

            TeamMember member = new TeamMember();
            member.setTeam(invitation.getTeam());
            member.setUser(user);
            memberRepository.save(member);
        }

        return toResponse(invitation);
    }

    @Transactional
    public InvitationResponse rejectInvitation(Long invitationId, User user) {

        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Invitation not found"));

        if (!invitation.getReceiver().getId().equals(user.getId())) {
            throw new ForbiddenException(
                    "You can only respond to your own invitations");
        }

        if (invitation.getStatus() != InvitationStatus.PENDING) {
            throw new BadRequestException(
                    "This invitation has already been " +
                            invitation.getStatus().name().toLowerCase());
        }

        invitation.setStatus(InvitationStatus.REJECTED);
        invitationRepository.save(invitation);

        return toResponse(invitation);
    }

    public List<InvitationResponse> getReceivedInvitations(User user) {
        return invitationRepository.findByReceiver(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<InvitationResponse> getSentInvitations(User user) {
        return invitationRepository.findBySender(user)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<InvitationResponse> getTeamInvitations(Long teamId,
                                                        User requester) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Team not found"));

        if (!team.getLeader().getId().equals(requester.getId())) {
            throw new ForbiddenException(
                    "Only the team leader can view team invitations");
        }

        return invitationRepository.findByTeam(team)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private InvitationResponse toResponse(Invitation inv) {
        InvitationResponse r = new InvitationResponse();
        r.setId(inv.getId());
        r.setTeamId(inv.getTeam().getId());
        r.setTeamName(inv.getTeam().getName());
        r.setHackathonId(inv.getTeam().getHackathon().getId());
        r.setHackathonTitle(inv.getTeam().getHackathon().getTitle());
        r.setSenderId(inv.getSender().getId());
        r.setSenderName(inv.getSender().getName());
        r.setReceiverId(inv.getReceiver().getId());
        r.setReceiverName(inv.getReceiver().getName());
        r.setStatus(inv.getStatus());
        r.setCreatedAt(inv.getCreatedAt());
        r.setUpdatedAt(inv.getUpdatedAt());
        return r;
    }
}
