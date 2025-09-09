package com.amin.backend.services

import com.amin.backend.dtos.CommentDto
import com.amin.backend.mappers.CommentMapper
import com.amin.backend.models.CommentLike
import com.amin.backend.repositories.CommentLikeRepository
import com.amin.backend.repositories.CommentRepository
import com.amin.backend.repositories.UserRepository
import org.springframework.stereotype.Service
import java.nio.file.AccessDeniedException
import java.time.LocalDateTime

@Service
class CommentService(
    private val commentRepository: CommentRepository,
    private val userRepository: UserRepository,
    private val commentLikeRepository: CommentLikeRepository
) {

    fun getAllByResumeId(resumeId: Long, currentUserId: Long? = null): List<CommentDto> {
        val comments = commentRepository.findByResumeId(resumeId)

        if (currentUserId == null) {
            return comments.map { comment ->
                val likes = commentLikeRepository.countLikesByCommentId(comment.id!!)
                val dislikes = commentLikeRepository.countDislikesByCommentId(comment.id!!)
                CommentMapper.toDto(comment, likes.toInt(), dislikes.toInt())
            }
        }

        // Get user's like statuses for all comments
        val commentIds = comments.mapNotNull { it.id }
        val userLikes = commentLikeRepository.findByCommentIdsAndUserId(commentIds, currentUserId)
        val likeStatusMap = userLikes.associate {
            it.comment.id to if (it.isLike) "liked" else "disliked"
        }

        return comments.map { comment ->
            val likes = commentLikeRepository.countLikesByCommentId(comment.id!!)
            val dislikes = commentLikeRepository.countDislikesByCommentId(comment.id!!)
            val userLikeStatus = likeStatusMap[comment.id]
            CommentMapper.toDto(comment, likes.toInt(), dislikes.toInt(), userLikeStatus)
        }
    }

    fun save(dto: CommentDto): CommentDto {
        val user = userRepository.findById(dto.userId).orElseThrow {
            IllegalArgumentException("User with ID ${dto.userId} not found")
        }
        val saved = commentRepository.save(CommentMapper.toEntity(dto, user))
        return CommentMapper.toDto(saved, 0, 0) // New comment starts with 0 likes/dislikes
    }

    fun getReplies(parentCommentId: Long): List<CommentDto> =
        commentRepository.findByParentCommentId(parentCommentId).map { comment ->
            val likes = commentLikeRepository.countLikesByCommentId(comment.id!!)
            val dislikes = commentLikeRepository.countDislikesByCommentId(comment.id!!)
            CommentMapper.toDto(comment, likes.toInt(), dislikes.toInt())
        }    fun updateComment(id: Long, newContent: String): CommentDto {
        val comment = commentRepository.findById(id).orElseThrow {
            IllegalArgumentException("Comment not found")
        }
        val updatedComment = comment.copy(content = newContent, updatedAt = LocalDateTime.now())
        val saved = commentRepository.save(updatedComment)
        val likes = commentLikeRepository.countLikesByCommentId(saved.id!!)
        val dislikes = commentLikeRepository.countDislikesByCommentId(saved.id!!)
        return CommentMapper.toDto(saved, likes.toInt(), dislikes.toInt())
    }

    fun deleteComment(commentId: Long, requestingUserId: Long, isAdmin: Boolean = false) {
        val comment = commentRepository.findById(commentId).orElseThrow {
            IllegalArgumentException("Comment with ID $commentId not found")
        }

        if (!isAdmin && comment.user.id != requestingUserId) {
            throw AccessDeniedException("You are not authorized to delete this comment")
        }

        // Delete all likes/dislikes for this comment
        val commentLikes = commentLikeRepository.findByCommentId(commentId)
        commentLikeRepository.deleteAll(commentLikes)

        val replies = commentRepository.findByParentCommentId(commentId)
        // Delete likes for replies too
        replies.forEach { reply ->
            val replyLikes = commentLikeRepository.findByCommentId(reply.id!!)
            commentLikeRepository.deleteAll(replyLikes)
        }
        commentRepository.deleteAll(replies)

        commentRepository.delete(comment)
    }

    fun countComments(resumeId: Long): Int = commentRepository.countByResumeId(resumeId)

    fun toggleLike(commentId: Long, userId: Long): CommentDto {
        val comment = commentRepository.findById(commentId).orElseThrow {
            IllegalArgumentException("Comment not found")
        }
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("User not found")
        }

        val existingLike = commentLikeRepository.findByCommentIdAndUserId(commentId, userId)

        when {
            existingLike == null -> {
                // User hasn't liked/disliked yet, create a like
                val newLike = CommentLike(
                    comment = comment,
                    user = user,
                    isLike = true
                )
                commentLikeRepository.save(newLike)
            }

            existingLike.isLike -> {
                // User already liked, remove the like
                commentLikeRepository.delete(existingLike)
            }

            else -> {
                // User disliked, change to like
                val updatedLike = existingLike.copy(isLike = true)
                commentLikeRepository.save(updatedLike)
            }
        }

        // Return updated comment with current counts and user status
        return getUpdatedCommentDto(commentId, userId)
    }

    fun toggleDislike(commentId: Long, userId: Long): CommentDto {
        val comment = commentRepository.findById(commentId).orElseThrow {
            IllegalArgumentException("Comment not found")
        }
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("User not found")
        }

        val existingLike = commentLikeRepository.findByCommentIdAndUserId(commentId, userId)

        when {
            existingLike == null -> {
                // User hasn't liked/disliked yet, create a dislike
                val newDislike = CommentLike(
                    comment = comment,
                    user = user,
                    isLike = false
                )
                commentLikeRepository.save(newDislike)
            }

            !existingLike.isLike -> {
                // User already disliked, remove the dislike
                commentLikeRepository.delete(existingLike)
            }

            else -> {
                // User liked, change to dislike
                val updatedLike = existingLike.copy(isLike = false)
                commentLikeRepository.save(updatedLike)
            }
        }

        // Return updated comment with current counts and user status
        return getUpdatedCommentDto(commentId, userId)
    }

    private fun getUpdatedCommentDto(commentId: Long, userId: Long): CommentDto {
        val comment = commentRepository.findById(commentId).orElseThrow {
            IllegalArgumentException("Comment not found")
        }

        val likes = commentLikeRepository.countLikesByCommentId(commentId)
        val dislikes = commentLikeRepository.countDislikesByCommentId(commentId)
        val userLike = commentLikeRepository.findByCommentIdAndUserId(commentId, userId)

        val userLikeStatus = when {
            userLike == null -> null
            userLike.isLike -> "liked"
            else -> "disliked"
        }

        return CommentMapper.toDto(comment, likes.toInt(), dislikes.toInt(), userLikeStatus)
    }
}
