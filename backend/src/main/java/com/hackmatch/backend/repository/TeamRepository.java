package com.hackmatch.backend.repository;

import com.hackmatch.backend.entity.Hackathon;
import com.hackmatch.backend.entity.Team;
import com.hackmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {

    List<Team> findByHackathon(Hackathon hackathon);

    List<Team> findByLeader(User leader);

    List<Team> findByHackathonId(Long hackathonId);
}
