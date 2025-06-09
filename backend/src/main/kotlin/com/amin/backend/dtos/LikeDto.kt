package com.amin.backend.dtos

import java.time.LocalDateTime

data class LikeDto(
    val id: Long? = null,
    val resumeId: Long,
    val userId: Long,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
