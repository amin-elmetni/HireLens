package com.amin.backend.mappers

import com.amin.backend.dtos.LikeDto
import com.amin.backend.models.Like
import com.amin.backend.models.User

object LikeMapper {
    fun toDto(like: Like): LikeDto = LikeDto(
        id = like.id,
        resumeId = like.resumeId,
        userId = like.user.id ?: 0,
        createdAt = like.createdAt
    )

    fun toEntity(dto: LikeDto, user: User): Like = Like(
        id = dto.id,
        resumeId = dto.resumeId,
        user = user,
        createdAt = dto.createdAt
    )
}
