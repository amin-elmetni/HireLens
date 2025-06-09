package com.amin.backend.services

import com.amin.backend.dtos.ResumeFilterOptionsDto
import com.amin.backend.dtos.ResumeMetadataDto
import com.amin.backend.mappers.ResumeMetadataMapper
import com.amin.backend.repositories.ResumeMetadataRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class ResumeMetadataService(private val repo: ResumeMetadataRepository) {

    fun getByUuid(uuid: UUID): ResumeMetadataDto? =
        repo.findByUuid(uuid)?.let { ResumeMetadataMapper.toDto(it) }

    fun getFilterOptions(): ResumeFilterOptionsDto =
        repo.getFilterOptions()

    fun getFilteredResumes(
        categories: List<String>?,
        skills: List<String>?,
        languages: List<String>?,
        expMin: Int?,
        expMax: Int?
    ): List<ResumeMetadataDto> {
        val filtered = repo.findByFilters(categories, skills, languages, expMin, expMax)
        return filtered.map { ResumeMetadataMapper.toDto(it) }
    }

}
