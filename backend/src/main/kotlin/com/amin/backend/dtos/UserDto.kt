package com.amin.backend.dtos

import com.amin.backend.enums.UserRole

data class UserDto(
    val id: Long? = null,
    val name: String,
    val email: String,
    val password: String? = null, // nullable for read ops
    val avatar: String? = null,
    val role: UserRole,
    val isVerified: Boolean = false
)
