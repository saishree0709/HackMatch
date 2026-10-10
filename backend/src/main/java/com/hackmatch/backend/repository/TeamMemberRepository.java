package com.hackmatch.backend.repository;

import com.hackmatch.backend.entity.Team;
import com.hackmatch.backend.entity.TeamMember;
import com.hackmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMemberRepository extends JpaRepository<TeamMember, Long> {

    List<TeamMember> findByTeam(Team team);

    List<TeamMember> findByUser(User user);

    boolean existsByTeamAndUser(Team team, User user);

    boolean existsByTeamIdAndUserId(Long teamId, Long userId);
}
