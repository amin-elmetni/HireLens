package com.amin.backend.mappers

import com.amin.backend.dtos.CollectionItemDto
import com.amin.backend.models.Collection
import com.amin.backend.models.CollectionItem

object CollectionItemMapper {
    fun toDto(item: CollectionItem): CollectionItemDto = CollectionItemDto(
        id = item.id,
        collectionId = item.collection.id ?: 0,
        resumeId = item.resumeId,
        addedAt = item.addedAt
    )

    fun toEntity(dto: CollectionItemDto, collection: Collection): CollectionItem = CollectionItem(
        id = dto.id,
        collection = collection,
        resumeId = dto.resumeId,
        addedAt = dto.addedAt
    )
}
