package com.amin.backend.services

import com.amin.backend.dtos.ResumeFilterOptionsDto
import com.amin.backend.dtos.ResumeMetadataDto
import com.amin.backend.mappers.ResumeMetadataMapper
import com.amin.backend.repositories.ResumeMetadataRepository
import org.springframework.stereotype.Service

@Service
class ResumeMetadataService(private val repo: ResumeMetadataRepository) {

    fun getByUuid(uuid: String): ResumeMetadataDto? =
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

    fun getSimilarResumes(uuid: String, categoryFilter: String? = null): List<ResumeMetadataDto> {
        // Get the current resume
        val currentResume = repo.findByUuid(uuid) ?: return emptyList()
        
        println("Debug - Current resume UUID: $uuid")
        println("Debug - Category filter provided: $categoryFilter")
        println("Debug - Current resume categories: ${currentResume.categories}")
        
        // Use the provided category filter, or find the top category if not provided
        val targetCategory = categoryFilter ?: run {
            val topCategory = currentResume.categories
                ?.filter { it.score != null && it.name != null }
                ?.maxByOrNull { it.score!! }
                ?.name
            topCategory
        }
        
        println("Debug - Target category for search: '$targetCategory'")
        
        if (targetCategory == null) return emptyList()
        
        // Find resumes with the same target category, excluding the current resume
        val similarResumes = repo.findByCategory(targetCategory, uuid)
        
        println("Debug - Found ${similarResumes.size} similar resumes for category: '$targetCategory'")
        
        // Additional debugging: Show what categories the found resumes have
        similarResumes.forEach { resume ->
            val resumeCategories = resume.categories?.map { "${it.name} (${it.score})" }
            println("Debug - Similar resume: ${resume.name} - UUID: ${resume.uuid} - Categories: $resumeCategories")
        }
        
        return similarResumes.map { ResumeMetadataMapper.toDto(it) }
    }

    fun debugCategories(): Map<String, Any> {
        val allResumes = repo.findAll()
        val categoryMap = mutableMapOf<String, Int>()
        val resumeCategories = mutableMapOf<String, List<String>>()
        
        allResumes.forEach { resume ->
            val categories = resume.categories?.map { it.name ?: "null" } ?: listOf("no categories")
            resumeCategories[resume.name ?: "unnamed"] = categories
            
            categories.forEach { category ->
                categoryMap[category] = categoryMap.getOrDefault(category, 0) + 1
            }
        }
        
        return mapOf(
            "totalResumes" to allResumes.size,
            "categoryCount" to categoryMap,
            "sampleResumeCategories" to resumeCategories.entries.take(5).associate { it.key to it.value }
        )
    }

}
