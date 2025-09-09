package com.amin.backend.mappers

import com.amin.backend.dtos.CommentDto
import com.amin.backend.models.Comment
import com.amin.backend.models.User

object CommentMapper {

    fun toDto(comment: Comment, likes: Int = 0, dislikes: Int = 0, userLikeStatus: String? = null): CommentDto =
        CommentDto(
            id = comment.id,
            userId = comment.user.id ?: 0,
            userName = comment.user.name,
            resumeId = comment.resumeId,
            content = comment.content,
            parentCommentId = comment.parentCommentId,
            createdAt = comment.createdAt,
            updatedAt = comment.updatedAt,
            likes = likes,
            dislikes = dislikes,
            userLikeStatus = userLikeStatus
        )

    fun toEntity(dto: CommentDto, user: User): Comment =
        Comment(
            id = dto.id,
            user = user,
            resumeId = dto.resumeId,
            content = dto.content,
            parentCommentId = dto.parentCommentId,
            createdAt = dto.createdAt,
            updatedAt = dto.updatedAt,
        )
}
