package com.amin.backend.controllers

import com.amin.backend.dtos.SaveDto
import com.amin.backend.services.SaveService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/saves")
class SaveController(private val saveService: SaveService) {

    @PostMapping
    fun save(@RequestBody dto: SaveDto): SaveDto =
        saveService.saveResume(dto)

    @DeleteMapping("/{userId}/{resumeId}")
    fun unsave(@PathVariable userId: Long, @PathVariable resumeId: Long) =
        saveService.unsaveResume(userId, resumeId)

    @GetMapping("/resume/{resumeId}")
    fun getSaves(@PathVariable resumeId: Long): List<SaveDto> =
        saveService.getSavesByResume(resumeId)

    @GetMapping("/check/{userId}/{resumeId}")
    fun hasSaved(@PathVariable userId: Long, @PathVariable resumeId: Long): Boolean =
        saveService.hasUserSaved(userId, resumeId)

    @GetMapping("/count/{resumeId}")
    fun count(@PathVariable resumeId: Long): Int =
        saveService.countSaves(resumeId)

    @GetMapping("/user/{userId}")
    fun getSavesByUser(@PathVariable userId: Long): List<SaveDto> =
        saveService.getSavesByUser(userId)
}
