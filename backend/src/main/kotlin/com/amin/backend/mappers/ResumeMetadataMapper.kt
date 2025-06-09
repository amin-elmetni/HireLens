package com.amin.backend.mappers

import com.amin.backend.dtos.*
import com.amin.backend.models.ResumeMetadata

object ResumeMetadataMapper {
    fun toDto(entity: ResumeMetadata): ResumeMetadataDto = ResumeMetadataDto(
        id = entity.id,
        name = entity.name,
        age = entity.age,
        email = entity.email,
        phone = entity.phone,
        summary = entity.summary,
        personalLinks = PersonalLinksDto(
            entity.personalLinks?.github,
            entity.personalLinks?.linkedin,
            entity.personalLinks?.portfolio
        ),
        address = AddressDto(
            entity.address?.city,
            entity.address?.country,
        ),
        skills = entity.skills?.map { SkillDto(it.name, it.score) },
        languages = entity.languages,
        experiences = entity.experiences?.map { ExperienceDto(it.jobTitle, it.company, it.duration, it.description) },
        projects = entity.projects?.map { ProjectDto(it.projectTitle, it.projectSummary) },
        education = entity.education?.map { EducationDto(it.degree, it.institution, it.year) },
        certifications = entity.certifications,
        yearsOfExperience = entity.yearsOfExperience,
        categories = entity.categories?.map { CategoryDto(it.name, it.score) },
        finalScore = entity.finalScore,
        lastUpdated = entity.lastUpdated,
        uuid = entity.uuid
    )
}
