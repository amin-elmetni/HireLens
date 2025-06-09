package com.amin.backend.services

import com.amin.backend.config.security.JwtService
import com.amin.backend.dtos.AuthResponse
import com.amin.backend.dtos.LoginRequest
import com.amin.backend.dtos.UserDto
import com.amin.backend.repositories.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtService: JwtService
) {

    fun login(request: LoginRequest): AuthResponse {
        val user = userRepository.findByEmail(request.email)
            .orElseThrow { IllegalArgumentException("Invalid credentials") }

        if (!passwordEncoder.matches(request.password, user.password)) {
            throw IllegalArgumentException("Invalid credentials")
        }

        val token = jwtService.generateToken(user)
        val userDto = UserDto(
            id = user.id,
            name = user.name,
            email = user.email,
            role = user.role,
            avatar = user.avatar,
            isVerified = user.isVerified
        )

        return AuthResponse(token, userDto)
    }

}
