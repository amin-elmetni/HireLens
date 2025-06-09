package com.amin.backend.services

import com.amin.backend.dtos.LikeDto
import com.amin.backend.mappers.LikeMapper
import com.amin.backend.repositories.LikeRepository
import com.amin.backend.repositories.UserRepository
import org.springframework.stereotype.Service

@Service
class LikeService(
    private val likeRepository: LikeRepository,
    private val userRepository: UserRepository
) {
    fun likeResume(dto: LikeDto): LikeDto {
        val user = userRepository.findById(dto.userId).orElseThrow {
            IllegalArgumentException("User not found")
        }

        // prevent duplicate likes
        if (likeRepository.existsByUserAndResumeId(user, dto.resumeId)) {
            throw IllegalArgumentException("Already liked")
        }

        val saved = likeRepository.save(LikeMapper.toEntity(dto, user))
        return LikeMapper.toDto(saved)
    }

    fun unlikeResume(userId: Long, resumeId: Long) {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("User not found")
        }
        val like = likeRepository.findByUserAndResumeId(user, resumeId)
            ?: throw IllegalArgumentException("Like not found")

        likeRepository.delete(like)
    }

    fun countLikes(resumeId: Long): Int =
        likeRepository.countByResumeId(resumeId)

    fun getLikes(resumeId: Long): List<LikeDto> =
        likeRepository.findByResumeId(resumeId).map { LikeMapper.toDto(it) }

    fun hasUserLiked(userId: Long, resumeId: Long): Boolean {
        val user = userRepository.findById(userId).orElse(null) ?: return false
        return likeRepository.existsByUserAndResumeId(user, resumeId)
    }
}
