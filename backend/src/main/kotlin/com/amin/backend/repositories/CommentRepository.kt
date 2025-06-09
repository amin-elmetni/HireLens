package com.amin.backend.repositories

import com.amin.backend.models.Comment
import org.springframework.data.jpa.repository.JpaRepository

interface CommentRepository : JpaRepository<Comment, Long> {
    fun findByResumeId(resumeId: Long): List<Comment>
    fun findByParentCommentId(parentCommentId: Long): List<Comment>
    fun findByResumeIdOrderByCreatedAtAsc(resumeId: Long): List<Comment>
    fun findByParentCommentIdOrderByCreatedAtAsc(parentCommentId: Long): List<Comment>
    fun countByResumeId(resumeId: Long): Int
}
