package com.hackmatch.backend.repository;

import com.hackmatch.backend.entity.Invitation;
import com.hackmatch.backend.entity.InvitationStatus;
import com.hackmatch.backend.entity.Team;
import com.hackmatch.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {

    List<Invitation> findByReceiver(User receiver);

    List<Invitation> findBySender(User sender);

    List<Invitation> findByTeam(Team team);

    List<Invitation> findByReceiverAndStatus(User receiver, InvitationStatus status);

    Optional<Invitation> findByTeamAndReceiverAndStatus(
            Team team, User receiver, InvitationStatus status);

    boolean existsByTeamAndReceiverAndStatus(
            Team team, User receiver, InvitationStatus status);
}
