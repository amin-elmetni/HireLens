package com.amin.backend.repositories

import com.amin.backend.models.ResumeMetadata
import com.amin.backend.repositories.custom.ResumeMetadataCustomRepository
import org.springframework.data.mongodb.repository.MongoRepository


interface ResumeMetadataRepository : MongoRepository<ResumeMetadata, String>, ResumeMetadataCustomRepository {
    fun findByUuid(uuid: String): ResumeMetadata?

    interface ResumeMetadataCustomRepository {
        fun findByFilters(
            categories: List<String>?,
            skills: List<String>?,
            languages: List<String>?,
            expMin: Int?,
            expMax: Int?
        ): List<ResumeMetadata>
    }
}