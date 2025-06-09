package com.amin.backend.dtos

import java.time.LocalDateTime

data class CollectionItemDto(
    val id: Long? = null,
    val collectionId: Long,
    val resumeId: Long,
    val addedAt: LocalDateTime = LocalDateTime.now()
)
