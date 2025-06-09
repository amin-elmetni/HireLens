package com.amin.backend.services

import com.amin.backend.dtos.SaveDto
import com.amin.backend.mappers.SaveMapper
import com.amin.backend.repositories.SaveRepository
import com.amin.backend.repositories.UserRepository
import org.springframework.stereotype.Service

@Service
class SaveService(
    private val saveRepository: SaveRepository,
    private val userRepository: UserRepository
) {
    fun saveResume(dto: SaveDto): SaveDto {
        val user = userRepository.findById(dto.userId).orElseThrow {
            IllegalArgumentException("User not found")
        }

        if (saveRepository.existsByUserAndResumeId(user, dto.resumeId)) {
            throw IllegalArgumentException("Resume already saved")
        }

        val saved = saveRepository.save(SaveMapper.toEntity(dto, user))
        return SaveMapper.toDto(saved)
    }

    fun unsaveResume(userId: Long, resumeId: Long) {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("User not found")
        }
        val save = saveRepository.findByUserAndResumeId(user, resumeId)
            ?: throw IllegalArgumentException("Save not found")

        saveRepository.delete(save)
    }

    fun getSavesByResume(resumeId: Long): List<SaveDto> =
        saveRepository.findByResumeId(resumeId).map(SaveMapper::toDto)

    fun hasUserSaved(userId: Long, resumeId: Long): Boolean {
        val user = userRepository.findById(userId).orElse(null) ?: return false
        return saveRepository.existsByUserAndResumeId(user, resumeId)
    }

    fun countSaves(resumeId: Long): Int =
        saveRepository.countByResumeId(resumeId)
}
