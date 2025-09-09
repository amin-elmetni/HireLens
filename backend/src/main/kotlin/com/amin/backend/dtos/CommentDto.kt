package com.amin.backend.dtos

import java.time.LocalDateTime

data class CommentDto(
    val id: Long? = null,
    val userId: Long,
    val userName: String,
    val resumeId: Long,
    val content: String,
    val parentCommentId: Long? = null,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now(),
    val likes: Int = 0,
    val dislikes: Int = 0,
    val userLikeStatus: String? = null // "liked", "disliked", or null
)
