package com.amin.backend.controllers

import com.amin.backend.dtos.LikeDto
import com.amin.backend.services.LikeService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/likes")
class LikeController(private val likeService: LikeService) {

    @PostMapping
    fun like(@RequestBody dto: LikeDto): LikeDto =
        likeService.likeResume(dto)

    @DeleteMapping("/{userId}/{resumeId}")
    fun unlike(@PathVariable userId: Long, @PathVariable resumeId: Long) =
        likeService.unlikeResume(userId, resumeId)

    @GetMapping("/count/{resumeId}")
    fun count(@PathVariable resumeId: Long): Int =
        likeService.countLikes(resumeId)

    @GetMapping("/resume/{resumeId}")
    fun getLikes(@PathVariable resumeId: Long): List<LikeDto> =
        likeService.getLikes(resumeId)

    @GetMapping("/check/{userId}/{resumeId}")
    fun hasLiked(@PathVariable userId: Long, @PathVariable resumeId: Long): Boolean =
        likeService.hasUserLiked(userId, resumeId)
}
