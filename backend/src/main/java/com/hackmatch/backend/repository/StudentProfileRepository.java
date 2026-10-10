package com.hackmatch.backend.repository;

import com.hackmatch.backend.entity.StudentProfile;
import com.hackmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StudentProfileRepository
        extends JpaRepository<StudentProfile, Long> {

    Optional<StudentProfile> findByUser(User user);

    boolean existsByUser(User user);
}