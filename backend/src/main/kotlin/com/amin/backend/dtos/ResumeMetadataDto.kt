package com.amin.backend.dtos

import java.time.Instant
import java.util.*


data class ResumeMetadataDto(
    val id: String? = null,
    val name: String? = null,
    val email: String? = null,
    val age: Int? = null,
    val phone: String? = null,
    val summary: String? = null,
    val personalLinks: PersonalLinksDto? = null,
    val address: AddressDto? = null,
    val skills: List<SkillDto>? = null,
    val languages: List<String>? = listOf(),
    val experiences: List<ExperienceDto>? = listOf(),
    val projects: List<ProjectDto>? = listOf(),
    val education: List<EducationDto>? = listOf(),
    val certifications: List<String>? = listOf(),
    val yearsOfExperience: Int? = null,
    val categories: List<CategoryDto>? = listOf(),
    val finalScore: Double? = null,
    val lastUpdated: Instant = Instant.now(),
    val uuid: UUID? = null,
)

data class PersonalLinksDto(
    val github: String?,
    val linkedin: String?,
    val portfolio: String?
)

data class SkillDto(
    val name: String?,
    val score: Double?
)

data class ExperienceDto(
    val jobTitle: String?,
    val company: String?,
    val duration: String?,
    val description: String? = null
)

data class ProjectDto(
    val projectTitle: String?,
    val projectSummary: String?
)

data class EducationDto(
    val degree: String?,
    val institution: String?,
    val year: String?
)

data class CategoryDto(
    val name: String?,
    val score: Double?
)

data class AddressDto(
    val city: String?,
    val country: String?
)
