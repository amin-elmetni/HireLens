package com.amin.backend.models

import jakarta.persistence.*
import java.time.LocalDateTime
import java.util.*

@Entity
@Table(name = "resumes")
data class Resume(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "resume_id")
    val id: Long? = null,

    @Column(name = "uploaded_by")
    val uploadedBy: Long? = null,

    @Column(name = "updated_by")
    val updatedBy: Long? = null,

    @Column(name = "source_path")
    val sourcePath: String,

    @Column(name = "storage_path")
    val storagePath: String,

    val title: String? = null,

    val summary: String? = null,

    @Column(unique = true)
    val uuid: UUID = UUID.randomUUID(),

    val parsed: Boolean = false,

    @Column(name = "content_hash", length = 64)
    val contentHash: String? = null,

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
)