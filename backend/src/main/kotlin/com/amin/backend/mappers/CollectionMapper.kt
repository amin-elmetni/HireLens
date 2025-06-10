package com.amin.backend.mappers

import com.amin.backend.dtos.CollectionDto
import com.amin.backend.models.Collection
import com.amin.backend.models.User

object CollectionMapper {
    fun toDto(collection: Collection): CollectionDto = CollectionDto(
        id = collection.id,
        name = collection.name,
        description = collection.description,
        visibility = collection.visibility,
        userId = collection.user.id ?: 0,
        createdAt = collection.createdAt,
        updatedAt = collection.updatedAt
    )

    fun toEntity(dto: CollectionDto, user: User): Collection = Collection(
        id = dto.id,
        name = dto.name,
        description = dto.description,
        visibility = dto.visibility,
        user = user,
        createdAt = dto.createdAt,
        updatedAt = dto.updatedAt
    )
}
