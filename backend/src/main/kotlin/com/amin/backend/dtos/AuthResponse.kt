package com.amin.backend.dtos

data class AuthResponse(
    val token: String,
    val user: UserDto
)
