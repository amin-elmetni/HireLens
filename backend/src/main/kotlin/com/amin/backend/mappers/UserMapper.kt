package com.amin.backend.mappers

import com.amin.backend.dtos.UserDto
import com.amin.backend.models.User
import java.time.LocalDateTime

object UserMapper {
    fun toDto(user: User): UserDto = UserDto(
        id = user.id,
        name = user.name,
        email = user.email,
        avatar = user.avatar,
        role = user.role,
        isVerified = user.isVerified
    )

    fun fromDto(dto: UserDto): User = User(
        id = dto.id,
        name = dto.name,
        email = dto.email,
        password = dto.password ?: "", // Required for creation
        avatar = dto.avatar,
        role = dto.role,
        isVerified = dto.isVerified,
        createdAt = LocalDateTime.now(),
        updatedAt = LocalDateTime.now()
    )
}
