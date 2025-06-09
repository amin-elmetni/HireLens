package com.amin.backend.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "saves")
data class Save(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "resume_id")
    val resumeId: Long,

    @ManyToOne
    @JoinColumn(name = "user_id")
    val user: User,

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
)
