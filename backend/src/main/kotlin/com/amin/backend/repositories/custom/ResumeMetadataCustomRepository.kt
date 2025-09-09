package com.amin.backend.repositories.custom

import com.amin.backend.dtos.ResumeFilterOptionsDto
import com.amin.backend.models.ResumeMetadata

interface ResumeMetadataCustomRepository {
    fun getFilterOptions(): ResumeFilterOptionsDto
    fun findByFilters(
        categories: List<String>?,
        skills: List<String>?,
        languages: List<String>?,
        expMin: Int?,
        expMax: Int?
    ): List<ResumeMetadata>
    
    fun findByCategory(categoryName: String, excludeUuid: String? = null): List<ResumeMetadata>
}
