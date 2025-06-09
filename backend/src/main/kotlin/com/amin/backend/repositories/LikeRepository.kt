package com.amin.backend.repositories

import com.amin.backend.models.Like
import com.amin.backend.models.User
import org.springframework.data.jpa.repository.JpaRepository

interface LikeRepository : JpaRepository<Like, Long> {
    fun findByResumeId(resumeId: Long): List<Like>
    fun findByUserAndResumeId(user: User, resumeId: Long): Like?
    fun countByResumeId(resumeId: Long): Int
    fun existsByUserAndResumeId(user: User, resumeId: Long): Boolean
}
