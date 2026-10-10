package com.hackmatch.backend.service;

import com.hackmatch.backend.dto.MatchResponse;
import com.hackmatch.backend.entity.StudentProfile;
import com.hackmatch.backend.entity.User;
import com.hackmatch.backend.repository.StudentProfileRepository;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchingService {

    private final StudentProfileRepository profileRepository;

    public MatchingService(StudentProfileRepository profileRepository) {
        this.profileRepository = profileRepository;
    }

    /**
     * Find and rank compatible teammates for the given user.
     * Returns a list of MatchResponse sorted by compatibilityScore descending.
     */
    public List<MatchResponse> findMatches(User currentUser) {

        StudentProfile myProfile = profileRepository
                .findByUser(currentUser)
                .orElse(null);

        if (myProfile == null) {
            return Collections.emptyList();
        }

        Set<String> mySkills = parseCSV(myProfile.getSkills());
        Set<String> myInterests = parseCSV(myProfile.getInterests());
        String myRole = normalize(myProfile.getPreferredRole());
        String myExperience = normalize(myProfile.getExperience());

        List<StudentProfile> allProfiles = profileRepository.findAll();

        List<MatchResponse> matches = new ArrayList<>();

        for (StudentProfile other : allProfiles) {

            // skip self
            if (other.getUser().getId().equals(currentUser.getId())) {
                continue;
            }

            Map<String, Integer> breakdown = new LinkedHashMap<>();

            // 1. Skill complementarity (40 points)
            //    Higher score when the other person has skills I don't have
            Set<String> otherSkills = parseCSV(other.getSkills());
            int skillScore = computeComplementarity(mySkills, otherSkills);
            breakdown.put("skillComplementarity", skillScore);

            // 2. Interest overlap (25 points)
            //    Higher score when we share interests
            Set<String> otherInterests = parseCSV(other.getInterests());
            int interestScore = computeOverlap(myInterests, otherInterests, 25);
            breakdown.put("interestOverlap", interestScore);

            // 3. Role diversity (20 points)
            //    Full points if different preferred roles (diverse team)
            String otherRole = normalize(other.getPreferredRole());
            int roleScore = myRole.equals(otherRole) ? 5 : 20;
            breakdown.put("roleDiversity", roleScore);

            // 4. Experience compatibility (15 points)
            String otherExperience = normalize(other.getExperience());
            int expScore = computeExperienceScore(myExperience, otherExperience);
            breakdown.put("experienceCompatibility", expScore);

            int total = breakdown.values().stream()
                    .mapToInt(Integer::intValue).sum();
            total = Math.min(100, Math.max(0, total));

            MatchResponse match = new MatchResponse();
            match.setUserId(other.getUser().getId());
            match.setName(other.getUser().getName());
            match.setEmail(other.getUser().getEmail());
            match.setSkills(other.getSkills());
            match.setInterests(other.getInterests());
            match.setExperience(other.getExperience());
            match.setPreferredRole(other.getPreferredRole());
            match.setCompatibilityScore(total);
            match.setScoreBreakdown(breakdown);

            matches.add(match);
        }

        // Sort by score descending
        matches.sort((a, b) ->
                Integer.compare(b.getCompatibilityScore(),
                                a.getCompatibilityScore()));

        return matches;
    }

    /**
     * Complementarity: points for skills the other person has
     * that I don't have. Max 40.
     */
    private int computeComplementarity(Set<String> mine, Set<String> theirs) {
        if (theirs.isEmpty()) return 0;

        Set<String> union = new HashSet<>(mine);
        union.addAll(theirs);

        if (union.isEmpty()) return 0;

        // Skills they bring that I lack
        Set<String> unique = new HashSet<>(theirs);
        unique.removeAll(mine);

        // Also give partial credit for shared skills (collaboration)
        Set<String> shared = new HashSet<>(mine);
        shared.retainAll(theirs);

        double complementScore = (double) unique.size() / union.size();
        double sharedScore = (double) shared.size() / union.size();

        // Weighted: 70% complementarity, 30% shared foundation
        double raw = (complementScore * 0.7 + sharedScore * 0.3) * 40;
        return (int) Math.round(raw);
    }

    /**
     * Interest overlap: more shared interests = higher score.
     */
    private int computeOverlap(Set<String> mine, Set<String> theirs,
                                int maxPoints) {
        if (mine.isEmpty() || theirs.isEmpty()) return 0;

        Set<String> union = new HashSet<>(mine);
        union.addAll(theirs);

        Set<String> intersection = new HashSet<>(mine);
        intersection.retainAll(theirs);

        if (union.isEmpty()) return 0;

        double ratio = (double) intersection.size() / union.size();
        return (int) Math.round(ratio * maxPoints);
    }

    /**
     * Experience compatibility: similar experience levels score higher.
     */
    private int computeExperienceScore(String mine, String theirs) {
        int myLevel = experienceLevel(mine);
        int theirLevel = experienceLevel(theirs);

        int diff = Math.abs(myLevel - theirLevel);

        if (diff == 0) return 15;
        if (diff == 1) return 10;
        if (diff == 2) return 5;
        return 2;
    }

    private int experienceLevel(String exp) {
        if (exp == null || exp.isBlank()) return 1;
        String lower = exp.toLowerCase();

        if (lower.contains("senior") || lower.contains("advanced")
                || lower.contains("expert") || lower.contains("5+")
                || lower.contains("professional")) return 4;
        if (lower.contains("intermediate") || lower.contains("mid")
                || lower.contains("3") || lower.contains("4")) return 3;
        if (lower.contains("junior") || lower.contains("1")
                || lower.contains("2") || lower.contains("some")) return 2;
        // beginner / freshman / no experience
        return 1;
    }

    private Set<String> parseCSV(String csv) {
        if (csv == null || csv.isBlank()) {
            return Collections.emptySet();
        }
        return Arrays.stream(csv.split(","))
                .map(String::trim)
                .map(String::toLowerCase)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toSet());
    }

    private String normalize(String s) {
        return s == null ? "" : s.trim().toLowerCase();
    }
}
