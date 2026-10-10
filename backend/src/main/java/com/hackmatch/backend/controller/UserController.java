package com.hackmatch.backend.controller;

import com.hackmatch.backend.dto.UserResponse;
import com.hackmatch.backend.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @GetMapping("/me")
    public UserResponse getCurrentUser(Authentication authentication) {

        User user = (User) authentication.getPrincipal();

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getCreatedAt()
        );
    }
}