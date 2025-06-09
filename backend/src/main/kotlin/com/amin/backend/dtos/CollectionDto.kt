package com.amin.backend.dtos

import com.amin.backend.enums.CollectionVisibility
import java.time.LocalDateTime

data class CollectionDto(
    val id: Long? = null,
    val name: String,
    val description: String? = null,
    val visibility: CollectionVisibility,
    val userId: Long,
    val userName: String,
    val createdAt: LocalDateTime = LocalDateTime.now(),
    val updatedAt: LocalDateTime = LocalDateTime.now()
)
