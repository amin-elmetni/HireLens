package com.amin.backend.services

import com.amin.backend.dtos.CollectionItemDto
import com.amin.backend.mappers.CollectionItemMapper
import com.amin.backend.repositories.CollectionItemRepository
import com.amin.backend.repositories.CollectionRepository
import org.springframework.stereotype.Service

@Service
class CollectionItemService(
    private val collectionItemRepository: CollectionItemRepository,
    private val collectionRepository: CollectionRepository
) {
    fun addItem(dto: CollectionItemDto): CollectionItemDto {
        val collection = collectionRepository.findById(dto.collectionId)
            .orElseThrow { IllegalArgumentException("Collection not found") }

        // Optional: prevent duplicate entries
        if (collectionItemRepository.existsByCollectionAndResumeId(collection, dto.resumeId)) {
            throw IllegalArgumentException("Resume already exists in this collection")
        }

        val entity = CollectionItemMapper.toEntity(dto, collection)
        return CollectionItemMapper.toDto(collectionItemRepository.save(entity))
    }

    fun getItemsByCollectionId(collectionId: Long): List<CollectionItemDto> {
        val collection = collectionRepository.findById(collectionId)
            .orElseThrow { IllegalArgumentException("Collection not found") }

        return collectionItemRepository.findByCollection(collection).map(CollectionItemMapper::toDto)
    }

    fun removeItem(collectionId: Long, resumeId: Long) {
        val collection = collectionRepository.findById(collectionId)
            .orElseThrow { IllegalArgumentException("Collection not found") }

        collectionItemRepository.deleteByCollectionAndResumeId(collection, resumeId)
    }
}
