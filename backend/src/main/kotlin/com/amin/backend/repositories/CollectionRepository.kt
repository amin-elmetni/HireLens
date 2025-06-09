package com.amin.backend.repositories

import com.amin.backend.models.Collection
import com.amin.backend.models.User
import org.springframework.data.jpa.repository.JpaRepository

interface CollectionRepository : JpaRepository<Collection, Long> {
    fun findByUser(user: User): List<Collection>
    fun findByVisibility(visibility: com.amin.backend.enums.CollectionVisibility): List<Collection>
    fun findByUserIdAndVisibility(
        userId: Long,
        visibility: com.amin.backend.enums.CollectionVisibility
    ): List<Collection>
}
