package com.hackmatch.backend.service;

import com.hackmatch.backend.dto.InvitationResponse;
import com.hackmatch.backend.entity.*;
import com.hackmatch.backend.exception.BadRequestException;
import com.hackmatch.backend.exception.ConflictException;
import com.hackmatch.backend.exception.ForbiddenException;
import com.hackmatch.backend.repository.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvitationServiceTest {

    @Mock
    private InvitationRepository invitationRepository;

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private TeamMemberRepository memberRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private InvitationService invitationService;

    private User leader;
    private User invitee;
    private Team team;
    private Hackathon hackathon;

    @BeforeEach
    void setUp() {
        leader = new User();
        leader.setId(1L);
        leader.setName("Leader");
        leader.setEmail("leader@test.com");

        invitee = new User();
        invitee.setId(2L);
        invitee.setName("Invitee");
        invitee.setEmail("invitee@test.com");

        hackathon = new Hackathon();
        hackathon.setId(5L);
        hackathon.setTitle("Hack 2026");

        team = new Team();
        team.setId(10L);
        team.setName("Team Alpha");
        team.setLeader(leader);
        team.setHackathon(hackathon);
    }

    @Test
    void sendInvitation_success() {
        when(teamRepository.findById(10L)).thenReturn(Optional.of(team));
        when(userRepository.findById(2L)).thenReturn(Optional.of(invitee));
        when(memberRepository.existsByTeamIdAndUserId(10L, 2L)).thenReturn(false);
        when(invitationRepository.existsByTeamAndReceiverAndStatus(team, invitee, InvitationStatus.PENDING)).thenReturn(false);

        Invitation saved = new Invitation();
        saved.setId(100L);
        saved.setTeam(team);
        saved.setSender(leader);
        saved.setReceiver(invitee);
        saved.setStatus(InvitationStatus.PENDING);

        when(invitationRepository.save(any(Invitation.class))).thenReturn(saved);

        InvitationResponse res = invitationService.sendInvitation(10L, 2L, leader);

        assertNotNull(res);
        assertEquals(InvitationStatus.PENDING, res.getStatus());
        assertEquals(2L, res.getReceiverId());
    }

    @Test
    void sendInvitation_forbiddenIfNotLeader() {
        when(teamRepository.findById(10L)).thenReturn(Optional.of(team));

        assertThrows(ForbiddenException.class,
                () -> invitationService.sendInvitation(10L, 2L, invitee));
    }

    @Test
    void sendInvitation_cannotInviteSelf() {
        when(teamRepository.findById(10L)).thenReturn(Optional.of(team));
        when(userRepository.findById(1L)).thenReturn(Optional.of(leader));

        assertThrows(BadRequestException.class,
                () -> invitationService.sendInvitation(10L, 1L, leader));
    }

    @Test
    void sendInvitation_conflictIfAlreadyMember() {
        when(teamRepository.findById(10L)).thenReturn(Optional.of(team));
        when(userRepository.findById(2L)).thenReturn(Optional.of(invitee));
        when(memberRepository.existsByTeamIdAndUserId(10L, 2L)).thenReturn(true);

        assertThrows(ConflictException.class,
                () -> invitationService.sendInvitation(10L, 2L, leader));
    }

    @Test
    void acceptInvitation_success() {
        Invitation inv = new Invitation();
        inv.setId(50L);
        inv.setTeam(team);
        inv.setSender(leader);
        inv.setReceiver(invitee);
        inv.setStatus(InvitationStatus.PENDING);

        when(invitationRepository.findById(50L)).thenReturn(Optional.of(inv));
        when(memberRepository.existsByTeamAndUser(team, invitee)).thenReturn(false);
        when(invitationRepository.save(any(Invitation.class))).thenReturn(inv);

        InvitationResponse res = invitationService.acceptInvitation(50L, invitee);

        assertEquals(InvitationStatus.ACCEPTED, res.getStatus());
        verify(memberRepository).save(any(TeamMember.class));
    }

    @Test
    void rejectInvitation_success() {
        Invitation inv = new Invitation();
        inv.setId(50L);
        inv.setTeam(team);
        inv.setSender(leader);
        inv.setReceiver(invitee);
        inv.setStatus(InvitationStatus.PENDING);

        when(invitationRepository.findById(50L)).thenReturn(Optional.of(inv));
        when(invitationRepository.save(any(Invitation.class))).thenReturn(inv);

        InvitationResponse res = invitationService.rejectInvitation(50L, invitee);

        assertEquals(InvitationStatus.REJECTED, res.getStatus());
        verify(memberRepository, never()).save(any(TeamMember.class));
    }

    @Test
    void acceptInvitation_forbiddenIfNotReceiver() {
        Invitation inv = new Invitation();
        inv.setId(50L);
        inv.setTeam(team);
        inv.setSender(leader);
        inv.setReceiver(invitee);
        inv.setStatus(InvitationStatus.PENDING);

        when(invitationRepository.findById(50L)).thenReturn(Optional.of(inv));

        assertThrows(ForbiddenException.class,
                () -> invitationService.acceptInvitation(50L, leader));
    }
}
