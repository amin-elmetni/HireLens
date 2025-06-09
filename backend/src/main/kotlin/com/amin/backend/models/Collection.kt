package com.amin.backend.models

import com.amin.backend.enums.CollectionVisibility
import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "collections")
data class Collection(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "collection_id")
    val id: Long? = null,

    val name: String,

    val description: String? = null,

    @Enumerated(EnumType.STRING)
    val visibility: CollectionVisibility,

    @ManyToOne
    @JoinColumn(name = "user_id")
    val user: User,

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now(),

    @Column(name = "updated_at")
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
