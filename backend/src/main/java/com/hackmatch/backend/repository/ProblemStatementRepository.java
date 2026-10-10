package com.hackmatch.backend.repository;

import com.hackmatch.backend.entity.Hackathon;
import com.hackmatch.backend.entity.ProblemStatement;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProblemStatementRepository
        extends JpaRepository<ProblemStatement, Long> {

    List<ProblemStatement> findByHackathon(Hackathon hackathon);
}