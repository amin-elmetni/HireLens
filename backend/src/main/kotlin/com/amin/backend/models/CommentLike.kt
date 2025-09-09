package com.amin.backend.models

import jakarta.persistence.*
import java.time.LocalDateTime

@Entity
@Table(
    name = "comment_likes",
    uniqueConstraints = [UniqueConstraint(columnNames = ["comment_id", "user_id"])]
)
data class CommentLike(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "like_id")
    val id: Long? = null,

    @ManyToOne
    @JoinColumn(name = "comment_id", nullable = false)
    val comment: Comment,

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    val user: User,

    @Column(name = "is_like")
    val isLike: Boolean, // true for like, false for dislike

    @Column(name = "created_at")
    val createdAt: LocalDateTime = LocalDateTime.now()
)
