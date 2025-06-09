package com.amin.backend.dtos

import java.time.LocalDateTime

data class SaveDto(
    val id: Long? = null,
    val resumeId: Long,
    val userId: Long,
    val createdAt: LocalDateTime = LocalDateTime.now()
)
