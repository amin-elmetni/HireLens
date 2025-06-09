package com.amin.backend.repositories

import com.amin.backend.models.Resume
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface ResumeRepository : JpaRepository<Resume, Long> {
    fun findByUuid(uuid: UUID): Resume?
    fun findByContentHash(contentHash: String): Resume?
    fun existsByContentHash(contentHash: String): Boolean
}