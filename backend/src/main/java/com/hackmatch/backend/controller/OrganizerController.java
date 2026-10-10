package com.hackmatch.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/organizer")
public class OrganizerController {

    @GetMapping("/test")
    public String organizerTest() {
        return "Organizer access granted!";
    }
}