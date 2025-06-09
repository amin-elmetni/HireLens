package com.amin.backend.controllers

import com.amin.backend.dtos.ResumeDto
import com.amin.backend.services.ResumeService
import org.springframework.beans.factory.annotation.Value
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.Resource
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.io.File
import java.util.*

@RestController
@RequestMapping("/api/resumes")
class ResumeController(private val resumeService: ResumeService) {

    @GetMapping
    fun getAll(): List<ResumeDto> = resumeService.getAll()

    @GetMapping("/{id}")
    fun getById(@PathVariable id: Long): ResumeDto? = resumeService.getById(id)

    @GetMapping("/uuid/{uuid}")
    fun getByUuid(@PathVariable uuid: UUID): ResumeDto? = resumeService.getByUuid(uuid)

    @GetMapping("/hash/{contentHash}")
    fun getByContentHash(@PathVariable contentHash: String): ResumeDto? =
        resumeService.getByContentHash(contentHash)

    @PostMapping
    fun save(@RequestBody dto: ResumeDto): ResumeDto = resumeService.save(dto)

    @PutMapping("/{uuid}/parsed")
    fun markAsParsed(@PathVariable uuid: UUID) = resumeService.markAsParsed(uuid)

    @GetMapping("/exists/{contentHash}")
    fun existsByContentHash(@PathVariable contentHash: String): Boolean =
        resumeService.existsByContentHash(contentHash)

    @Value("\${storage.resume-directory}")
    lateinit var resumeBaseDir: String

    @GetMapping("/view/{uuid}")
    fun viewResume(@PathVariable uuid: UUID): ResponseEntity<Resource> {
        val resume = resumeService.getByUuid(uuid)
            ?: return ResponseEntity.notFound().build()

        val file = File("$resumeBaseDir/${resume.storagePath}")
        if (!file.exists()) return ResponseEntity.notFound().build()

        val resource = FileSystemResource(file)

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"${file.name}\"")
            .contentType(MediaType.APPLICATION_PDF)
            .body(resource)
    }

    @GetMapping("/download/{uuid}")
    fun downloadResume(@PathVariable uuid: UUID): ResponseEntity<Resource> {
        val resume = resumeService.getByUuid(uuid)
            ?: return ResponseEntity.notFound().build()

        val file = File("$resumeBaseDir/${resume.storagePath}")
        if (!file.exists()) {
            return ResponseEntity.notFound().build()
        }

        val resource = FileSystemResource(file)

        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"${file.name}\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource)
    }
}