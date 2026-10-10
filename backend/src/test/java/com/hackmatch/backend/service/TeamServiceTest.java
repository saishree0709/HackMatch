package com.hackmatch.backend.service;

import com.hackmatch.backend.dto.TeamRequest;
import com.hackmatch.backend.dto.TeamResponse;
import com.hackmatch.backend.entity.*;
import com.hackmatch.backend.exception.ConflictException;
import com.hackmatch.backend.exception.ForbiddenException;
import com.hackmatch.backend.repository.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TeamServiceTest {

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private TeamMemberRepository memberRepository;

    @Mock
    private HackathonRepository hackathonRepository;

    @Mock
    private ProblemStatementRepository problemRepository;

    @InjectMocks
    private TeamService teamService;

    private User leader;
    private User otherUser;
    private Hackathon hackathon;

    @BeforeEach
    void setUp() {
        leader = new User();
        leader.setId(1L);
        leader.setName("Alice Leader");
        leader.setEmail("alice@test.com");
        leader.setRole(Role.STUDENT);

        otherUser = new User();
        otherUser.setId(2L);
        otherUser.setName("Bob Member");
        otherUser.setEmail("bob@test.com");
        otherUser.setRole(Role.STUDENT);

        hackathon = new Hackathon();
        hackathon.setId(10L);
        hackathon.setTitle("HackAI 2026");
        hackathon.setStartDate(LocalDate.now());
        hackathon.setEndDate(LocalDate.now().plusDays(2));
        hackathon.setLocation("Virtual");
        hackathon.setMode("Online");
    }

    @Test
    void createTeam_success() {
        TeamRequest req = new TeamRequest();
        req.setName("Innovators");
        req.setHackathonId(10L);

        when(hackathonRepository.findById(10L)).thenReturn(Optional.of(hackathon));

        Team savedTeam = new Team();
        savedTeam.setId(100L);
        savedTeam.setName("Innovators");
        savedTeam.setHackathon(hackathon);
        savedTeam.setLeader(leader);

        when(teamRepository.save(any(Team.class))).thenReturn(savedTeam);
        when(memberRepository.findByTeam(savedTeam)).thenReturn(Collections.emptyList());

        TeamResponse response = teamService.createTeam(req, leader);

        assertNotNull(response);
        assertEquals("Innovators", response.getName());
        assertEquals(10L, response.getHackathonId());
        assertEquals(1L, response.getLeaderId());
        verify(memberRepository).save(any(TeamMember.class));
    }

    @Test
    void addMember_forbiddenIfNotLeader() {
        Team team = new Team();
        team.setId(100L);
        team.setLeader(leader);

        when(teamRepository.findById(100L)).thenReturn(Optional.of(team));

        assertThrows(ForbiddenException.class,
                () -> teamService.addMember(100L, otherUser, otherUser));
    }

    @Test
    void addMember_conflictIfAlreadyMember() {
        Team team = new Team();
        team.setId(100L);
        team.setLeader(leader);

        when(teamRepository.findById(100L)).thenReturn(Optional.of(team));
        when(memberRepository.existsByTeamAndUser(team, otherUser)).thenReturn(true);

        assertThrows(ConflictException.class,
                () -> teamService.addMember(100L, otherUser, leader));
    }
}
