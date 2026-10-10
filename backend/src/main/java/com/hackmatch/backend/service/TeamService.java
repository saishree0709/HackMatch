package com.hackmatch.backend.service;

import com.hackmatch.backend.dto.TeamRequest;
import com.hackmatch.backend.dto.TeamResponse;
import com.hackmatch.backend.entity.*;
import com.hackmatch.backend.exception.*;
import com.hackmatch.backend.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository memberRepository;
    private final HackathonRepository hackathonRepository;
    private final ProblemStatementRepository problemRepository;

    public TeamService(TeamRepository teamRepository,
                       TeamMemberRepository memberRepository,
                       HackathonRepository hackathonRepository,
                       ProblemStatementRepository problemRepository) {
        this.teamRepository = teamRepository;
        this.memberRepository = memberRepository;
        this.hackathonRepository = hackathonRepository;
        this.problemRepository = problemRepository;
    }

    @Transactional
    public TeamResponse createTeam(TeamRequest request, User leader) {

        Hackathon hackathon = hackathonRepository
                .findById(request.getHackathonId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Hackathon not found"));

        Team team = new Team();
        team.setName(request.getName());
        team.setHackathon(hackathon);
        team.setLeader(leader);

        if (request.getProblemStatementId() != null) {
            ProblemStatement ps = problemRepository
                    .findById(request.getProblemStatementId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Problem statement not found"));
            team.setProblemStatement(ps);
        }

        team = teamRepository.save(team);

        // Add the leader as first member
        TeamMember leaderMember = new TeamMember();
        leaderMember.setTeam(team);
        leaderMember.setUser(leader);
        memberRepository.save(leaderMember);

        return toResponse(team);
    }

    public TeamResponse getTeamById(Long teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Team not found"));
        return toResponse(team);
    }

    public List<TeamResponse> getTeamsByHackathon(Long hackathonId) {
        return teamRepository.findByHackathonId(hackathonId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TeamResponse> getMyTeams(User user) {
        List<TeamMember> memberships = memberRepository.findByUser(user);
        return memberships.stream()
                .map(m -> toResponse(m.getTeam()))
                .collect(Collectors.toList());
    }

    @Transactional
    public void addMember(Long teamId, User user, User requester) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Team not found"));

        // Only the team leader can add members
        if (!team.getLeader().getId().equals(requester.getId())) {
            throw new ForbiddenException(
                    "Only the team leader can add members");
        }

        if (memberRepository.existsByTeamAndUser(team, user)) {
            throw new ConflictException(
                    "User is already a member of this team");
        }

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setUser(user);
        memberRepository.save(member);
    }

    public TeamResponse toResponse(Team team) {

        List<TeamMember> members = memberRepository.findByTeam(team);

        List<TeamResponse.TeamMemberInfo> memberInfos = members.stream()
                .map(m -> new TeamResponse.TeamMemberInfo(
                        m.getUser().getId(),
                        m.getUser().getName(),
                        m.getUser().getEmail(),
                        m.getJoinedAt()
                ))
                .collect(Collectors.toList());

        TeamResponse response = new TeamResponse();
        response.setId(team.getId());
        response.setName(team.getName());
        response.setHackathonId(team.getHackathon().getId());
        response.setHackathonTitle(team.getHackathon().getTitle());
        response.setLeaderId(team.getLeader().getId());
        response.setLeaderName(team.getLeader().getName());
        response.setMembers(memberInfos);
        response.setCreatedAt(team.getCreatedAt());

        if (team.getProblemStatement() != null) {
            response.setProblemStatementId(
                    team.getProblemStatement().getId());
            response.setProblemStatementTitle(
                    team.getProblemStatement().getTitle());
        }

        return response;
    }
}
