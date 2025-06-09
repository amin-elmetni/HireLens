package com.amin.backend.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(name = "collection_items")
data class CollectionItem(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "collection_id")
    val collection: Collection,

    @Column(name = "resume_id")
    val resumeId: Long, // Refers to resume ID in Postgres

    @Column(name = "added_at")
    val addedAt: LocalDateTime = LocalDateTime.now()
)
