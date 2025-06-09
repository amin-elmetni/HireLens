package com.amin.backend.services

import com.amin.backend.dtos.UserDto
import com.amin.backend.mappers.UserMapper
import com.amin.backend.repositories.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {
    fun getAllUsers(): List<UserDto> =
        userRepository.findAll().map(UserMapper::toDto)

    fun getUserById(id: Long): UserDto =
        userRepository.findById(id)
            .map(UserMapper::toDto)
            .orElseThrow { NoSuchElementException("User not found") }

    fun getUserByEmail(email: String): UserDto =
        userRepository.findByEmail(email)
            .map(UserMapper::toDto)
            .orElseThrow { NoSuchElementException("User not found") }

    fun createUser(userDto: UserDto): UserDto {
        if (userRepository.existsByEmail(userDto.email)) {
            throw IllegalArgumentException("Email already in use")
        }

        val encodedPassword = passwordEncoder.encode(userDto.password ?: "")
        val userToSave = UserMapper.fromDto(userDto.copy(password = encodedPassword))

        return UserMapper.toDto(userRepository.save(userToSave))
    }

    fun deleteUser(id: Long) {
        if (!userRepository.existsById(id)) {
            throw NoSuchElementException("User not found")
        }
        userRepository.deleteById(id)
    }
}
