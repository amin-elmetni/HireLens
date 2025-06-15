// ResumeMetadataController.kt
package com.amin.backend.controllers

import com.amin.backend.dtos.ResumeFilterOptionsDto
import com.amin.backend.dtos.ResumeMetadataDto
import com.amin.backend.services.ResumeMetadataService
import org.springframework.web.bind.annotation.*


@RestController
@RequestMapping("/api/resume-metadata")
class ResumeMetadataController(private val resumeMetadataService: ResumeMetadataService) {

    @GetMapping("/{uuid}")
    fun getByUuid(@PathVariable uuid: String): ResumeMetadataDto? =
        resumeMetadataService.getByUuid(uuid)

    @GetMapping("/filters")
    fun getFilters(): ResumeFilterOptionsDto =
        resumeMetadataService.getFilterOptions()

    @GetMapping
    fun getFilteredResumes(
        @RequestParam(required = false) categories: List<String>?,
        @RequestParam(required = false) skills: List<String>?,
        @RequestParam(required = false) languages: List<String>?,
        @RequestParam(required = false) expMin: Int?,
        @RequestParam(required = false) expMax: Int?
    ): List<ResumeMetadataDto> {
        return resumeMetadataService.getFilteredResumes(categories, skills, languages, expMin, expMax)
    }
}
