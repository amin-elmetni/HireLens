package com.amin.backend.repositories

import com.amin.backend.models.Save
import com.amin.backend.models.User
import org.springframework.data.jpa.repository.JpaRepository

interface SaveRepository : JpaRepository<Save, Long> {
    fun findByResumeId(resumeId: Long): List<Save>
    fun findByUserAndResumeId(user: User, resumeId: Long): Save?
    fun existsByUserAndResumeId(user: User, resumeId: Long): Boolean
    fun countByResumeId(resumeId: Long): Int
}
