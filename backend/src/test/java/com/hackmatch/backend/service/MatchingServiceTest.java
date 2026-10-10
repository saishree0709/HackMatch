package com.hackmatch.backend.service;

import com.hackmatch.backend.dto.MatchResponse;
import com.hackmatch.backend.entity.Role;
import com.hackmatch.backend.entity.StudentProfile;
import com.hackmatch.backend.entity.User;
import com.hackmatch.backend.repository.StudentProfileRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MatchingServiceTest {

    @Mock
    private StudentProfileRepository profileRepository;

    @InjectMocks
    private MatchingService matchingService;

    private User user1;
    private User user2;
    private User user3;

    @BeforeEach
    void setUp() {
        user1 = new User();
        user1.setId(1L);
        user1.setName("Alice");
        user1.setEmail("alice@test.com");
        user1.setRole(Role.STUDENT);

        user2 = new User();
        user2.setId(2L);
        user2.setName("Bob");
        user2.setEmail("bob@test.com");
        user2.setRole(Role.STUDENT);

        user3 = new User();
        user3.setId(3L);
        user3.setName("Charlie");
        user3.setEmail("charlie@test.com");
        user3.setRole(Role.STUDENT);
    }

    @Test
    void findMatches_returnsEmptyWhenNoProfile() {
        when(profileRepository.findByUser(user1))
                .thenReturn(Optional.empty());

        List<MatchResponse> matches = matchingService.findMatches(user1);

        assertTrue(matches.isEmpty());
    }

    @Test
    void findMatches_excludesSelf() {
        StudentProfile myProfile = createProfile(user1,
                "Java, Python", "AI, ML", "Intermediate", "Backend");

        when(profileRepository.findByUser(user1))
                .thenReturn(Optional.of(myProfile));
        when(profileRepository.findAll())
                .thenReturn(List.of(myProfile));

        List<MatchResponse> matches = matchingService.findMatches(user1);

        assertTrue(matches.isEmpty());
    }

    @Test
    void findMatches_sortsByScoreDescending() {
        StudentProfile p1 = createProfile(user1,
                "Java, Spring", "Web, Cloud", "Intermediate", "Backend");
        StudentProfile p2 = createProfile(user2,
                "React, CSS", "Web, Design", "Beginner", "Frontend");
        StudentProfile p3 = createProfile(user3,
                "Java, Spring, React", "Web, Cloud, AI", "Intermediate", "Fullstack");

        when(profileRepository.findByUser(user1))
                .thenReturn(Optional.of(p1));
        when(profileRepository.findAll())
                .thenReturn(List.of(p1, p2, p3));

        List<MatchResponse> matches = matchingService.findMatches(user1);

        assertEquals(2, matches.size());
        assertTrue(matches.get(0).getCompatibilityScore()
                >= matches.get(1).getCompatibilityScore());
    }

    @Test
    void findMatches_hasScoreBreakdown() {
        StudentProfile p1 = createProfile(user1,
                "Java", "ML", "Beginner", "Backend");
        StudentProfile p2 = createProfile(user2,
                "Python", "ML", "Beginner", "Frontend");

        when(profileRepository.findByUser(user1))
                .thenReturn(Optional.of(p1));
        when(profileRepository.findAll())
                .thenReturn(List.of(p1, p2));

        List<MatchResponse> matches = matchingService.findMatches(user1);

        assertEquals(1, matches.size());
        MatchResponse match = matches.get(0);

        assertNotNull(match.getScoreBreakdown());
        assertTrue(match.getScoreBreakdown().containsKey("skillComplementarity"));
        assertTrue(match.getScoreBreakdown().containsKey("interestOverlap"));
        assertTrue(match.getScoreBreakdown().containsKey("roleDiversity"));
        assertTrue(match.getScoreBreakdown().containsKey("experienceCompatibility"));

        int total = match.getScoreBreakdown().values().stream()
                .mapToInt(Integer::intValue).sum();
        assertEquals(match.getCompatibilityScore(), total);
    }

    @Test
    void findMatches_scoreInRange0to100() {
        StudentProfile p1 = createProfile(user1,
                "Java, Python, C++", "AI, ML, Data", "Expert", "Backend");
        StudentProfile p2 = createProfile(user2,
                "React, Angular, Vue", "Web, Mobile, UX", "Beginner", "Frontend");

        when(profileRepository.findByUser(user1))
                .thenReturn(Optional.of(p1));
        when(profileRepository.findAll())
                .thenReturn(List.of(p1, p2));

        List<MatchResponse> matches = matchingService.findMatches(user1);

        assertEquals(1, matches.size());
        int score = matches.get(0).getCompatibilityScore();
        assertTrue(score >= 0 && score <= 100,
                "Score should be between 0 and 100, was: " + score);
    }

    private StudentProfile createProfile(User user, String skills,
                                          String interests, String experience,
                                          String preferredRole) {
        StudentProfile p = new StudentProfile();
        p.setUser(user);
        p.setSkills(skills);
        p.setInterests(interests);
        p.setExperience(experience);
        p.setPreferredRole(preferredRole);
        return p;
    }
}
