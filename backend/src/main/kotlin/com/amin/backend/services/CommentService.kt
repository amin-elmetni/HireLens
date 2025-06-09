package com.amin.backend.services

import com.amin.backend.dtos.CommentDto
import com.amin.backend.mappers.CommentMapper
import com.amin.backend.repositories.CommentRepository
import com.amin.backend.repositories.UserRepository
import org.springframework.stereotype.Service
import java.nio.file.AccessDeniedException
import java.time.LocalDateTime

@Service
class CommentService(
    private val commentRepository: CommentRepository,
    private val userRepository: UserRepository
) {

    fun getAllByResumeId(resumeId: Long): List<CommentDto> =
        commentRepository.findByResumeId(resumeId)
            .map { CommentMapper.toDto(it) }

    fun save(dto: CommentDto): CommentDto {
        val user = userRepository.findById(dto.userId).orElseThrow {
            IllegalArgumentException("User with ID ${dto.userId} not found")
        }
        val saved = commentRepository.save(CommentMapper.toEntity(dto, user))
        return CommentMapper.toDto(saved)
    }

    fun getReplies(parentCommentId: Long): List<CommentDto> =
        commentRepository.findByParentCommentId(parentCommentId).map { CommentMapper.toDto(it) }

    fun updateComment(id: Long, newContent: String): CommentDto {
        val comment = commentRepository.findById(id).orElseThrow {
            IllegalArgumentException("Comment not found")
        }
        val updatedComment = comment.copy(content = newContent, updatedAt = LocalDateTime.now())
        return CommentMapper.toDto(commentRepository.save(updatedComment))
    }

    fun deleteComment(commentId: Long, requestingUserId: Long, isAdmin: Boolean = false) {
        val comment = commentRepository.findById(commentId).orElseThrow {
            IllegalArgumentException("Comment with ID $commentId not found")
        }

        if (!isAdmin && comment.user.id != requestingUserId) {
            throw AccessDeniedException("You are not authorized to delete this comment")
        }

        val replies = commentRepository.findByParentCommentId(commentId)
        commentRepository.deleteAll(replies)

        commentRepository.delete(comment)
    }

    fun countComments(resumeId: Long): Int = commentRepository.countByResumeId(resumeId)
}
