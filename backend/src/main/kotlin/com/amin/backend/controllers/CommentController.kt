package com.amin.backend.controllers

import com.amin.backend.dtos.CommentDto
import com.amin.backend.services.CommentService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/comments")
class CommentController(private val commentService: CommentService) {

    @GetMapping("/resume/{resumeId}")
    fun getCommentsByResume(@PathVariable resumeId: Long): List<CommentDto> =
        commentService.getAllByResumeId(resumeId)

    @PostMapping
    fun postComment(@RequestBody dto: CommentDto): CommentDto =
        commentService.save(dto)

    @GetMapping("/replies/{parentCommentId}")
    fun getReplies(@PathVariable parentCommentId: Long): List<CommentDto> =
        commentService.getReplies(parentCommentId)

    @PutMapping("/{commentId}")
    fun updateComment(@PathVariable commentId: Long, @RequestBody newContent: String): CommentDto =
        commentService.updateComment(commentId, newContent)

    @DeleteMapping("/{commentId}")
    fun deleteComment(
        @PathVariable commentId: Long,
        @RequestHeader("X-User-Id") userId: Long,
        @RequestHeader("X-Is-Admin", defaultValue = "false") isAdmin: Boolean
    ): ResponseEntity<Unit> {
        commentService.deleteComment(commentId, userId, isAdmin)
        return ResponseEntity.noContent().build()
    }

    @GetMapping("/count/{resumeId}")
    fun countComments(@PathVariable resumeId: Long): Int = commentService.countComments(resumeId)
}
