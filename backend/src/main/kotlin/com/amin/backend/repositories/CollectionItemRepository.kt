package com.amin.backend.repositories

import com.amin.backend.models.Collection
import com.amin.backend.models.CollectionItem
import org.springframework.data.jpa.repository.JpaRepository

interface CollectionItemRepository : JpaRepository<CollectionItem, Long> {
    fun findByCollection(collection: Collection): List<CollectionItem>
    fun deleteByCollectionAndResumeId(collection: Collection, resumeId: Long)
    fun existsByCollectionAndResumeId(collection: Collection, resumeId: Long): Boolean
}
