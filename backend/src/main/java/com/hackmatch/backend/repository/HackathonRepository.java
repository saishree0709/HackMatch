package com.hackmatch.backend.repository;

import com.hackmatch.backend.entity.Hackathon;
import com.hackmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HackathonRepository extends JpaRepository<Hackathon, Long> {

    List<Hackathon> findByOrganizer(User organizer);
}