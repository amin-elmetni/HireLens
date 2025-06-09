package com.amin.backend.services

import com.amin.backend.dtos.CollectionDto
import com.amin.backend.enums.CollectionVisibility
import com.amin.backend.mappers.CollectionMapper
import com.amin.backend.repositories.CollectionRepository
import com.amin.backend.repositories.UserRepository
import org.springframework.stereotype.Service

@Service
class CollectionService(
    private val collectionRepository: CollectionRepository,
    private val userRepository: UserRepository
) {
    fun createCollection(dto: CollectionDto): CollectionDto {
        val user = userRepository.findById(dto.userId).orElseThrow {
            IllegalArgumentException("User not found")
        }
        val collection = CollectionMapper.toEntity(dto, user)
        return CollectionMapper.toDto(collectionRepository.save(collection))
    }

    fun updateCollection(dto: CollectionDto): CollectionDto {
        val existing = collectionRepository.findById(dto.id ?: throw IllegalArgumentException("ID required"))
            .orElseThrow { IllegalArgumentException("Collection not found") }

        val updated = existing.copy(
            name = dto.name,
            description = dto.description,
            visibility = dto.visibility,
            updatedAt = dto.updatedAt
        )
        return CollectionMapper.toDto(collectionRepository.save(updated))
    }

    fun getUserCollections(userId: Long): List<CollectionDto> {
        val user = userRepository.findById(userId).orElseThrow {
            IllegalArgumentException("User not found")
        }
        return collectionRepository.findByUser(user).map(CollectionMapper::toDto)
    }

    fun getPublicCollections(): List<CollectionDto> =
        collectionRepository.findByVisibility(CollectionVisibility.PUBLIC)
            .map(CollectionMapper::toDto)

    fun getUserPublicCollections(userId: Long): List<CollectionDto> =
        collectionRepository.findByUserIdAndVisibility(userId, CollectionVisibility.PUBLIC)
            .map(CollectionMapper::toDto)

    fun deleteCollection(id: Long) {
        collectionRepository.deleteById(id)
    }
}
