package com.amin.backend.dtos

data class ResumeFilterOptionsDto(
    val skills: List<Map<String, Any>>,
    val categories: List<Map<String, Any>>,
    val languages: List<Map<String, Any>>,
    val minExperience: Int,
    val maxExperience: Int
)
