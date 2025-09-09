package com.amin.backend.repositories

import com.amin.backend.models.CommentLike
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface CommentLikeRepository : JpaRepository<CommentLike, Long> {
    
    fun findByCommentIdAndUserId(commentId: Long, userId: Long): CommentLike?
    
    fun findByCommentId(commentId: Long): List<CommentLike>
    
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.comment.id = :commentId AND cl.isLike = true")
    fun countLikesByCommentId(@Param("commentId") commentId: Long): Long
    
    @Query("SELECT COUNT(cl) FROM CommentLike cl WHERE cl.comment.id = :commentId AND cl.isLike = false")
    fun countDislikesByCommentId(@Param("commentId") commentId: Long): Long
    
    fun deleteByCommentIdAndUserId(commentId: Long, userId: Long)
    
    // Get user's like/dislike status for multiple comments at once
    @Query("SELECT cl FROM CommentLike cl WHERE cl.comment.id IN :commentIds AND cl.user.id = :userId")
    fun findByCommentIdsAndUserId(@Param("commentIds") commentIds: List<Long>, @Param("userId") userId: Long): List<CommentLike>
}
