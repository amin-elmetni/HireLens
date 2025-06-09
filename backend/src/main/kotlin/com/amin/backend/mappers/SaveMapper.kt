package com.amin.backend.mappers

import com.amin.backend.dtos.SaveDto
import com.amin.backend.models.Save
import com.amin.backend.models.User

object SaveMapper {
    fun toDto(save: Save): SaveDto = SaveDto(
        id = save.id,
        resumeId = save.resumeId,
        userId = save.user.id ?: 0,
        createdAt = save.createdAt
    )

    fun toEntity(dto: SaveDto, user: User): Save = Save(
        id = dto.id,
        resumeId = dto.resumeId,
        user = user,
        createdAt = dto.createdAt
    )
}
