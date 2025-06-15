package com.amin.backend.models

import org.springframework.data.annotation.Id
import org.springframework.data.mongodb.core.mapping.Document
import org.springframework.data.mongodb.core.mapping.Field
import java.time.Instant

@Document(collection = "resumes")
data class ResumeMetadata(
    @Id
    val id: String? = null,

    val name: String? = null,
    val age: Int? = null,
    val email: String? = null,
    val phone: String? = null,
    val summary: String? = null,

    @Field("personal_links")
    val personalLinks: PersonalLinks? = null,

    val address: Address? = null,
    val skills: List<Skill>? = listOf(),
    val languages: List<String>? = listOf(),
    val experiences: List<Experience>? = listOf(),
    val projects: List<Project>? = listOf(),
    val education: List<Education>? = listOf(),
    val certifications: List<String>? = listOf(),

    @Field("years_of_experience")
    val yearsOfExperience: Int? = null,

    val categories: List<Category>? = listOf(),

    @Field("final_score")
    val finalScore: Double? = null,

    @Field("last_updated")
    val lastUpdated: Instant = Instant.now(),

    val uuid: String? = null,
)

data class PersonalLinks(
    val github: String?,
    val linkedin: String?,
    val portfolio: String?
)

data class Skill(
    val name: String?,
    val score: Double?
)

data class Experience(
    @Field("job_title")
    val jobTitle: String?,
    val company: String?,
    val duration: String?,
    val description: String? = null
)

data class Project(
    @Field("project_title")
    val projectTitle: String?,
    @Field("project_summary")
    val projectSummary: String?
)

data class Education(
    val degree: String?,
    val institution: String?,
    val year: String?
)

data class Category(
    val name: String?,
    val score: Double?
)

data class Address(
    val city: String?,
    val country: String?
)