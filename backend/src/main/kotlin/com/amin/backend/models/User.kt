package com.amin.backend.models

import com.amin.backend.enums.UserRole
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    val id: Long? = null,

    val name: String,

    @Column(unique = true)
    val email: String,

    val password: String,

    val avatar: String? = null,

    @Enumerated(EnumType.STRING)
    val role: UserRole,

    @Column(name = "is_verified")
    val isVerified: Boolean = false,

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
