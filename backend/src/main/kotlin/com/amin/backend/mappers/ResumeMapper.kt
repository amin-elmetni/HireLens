package com.amin.backend.mappers

import com.amin.backend.dtos.ResumeDto
import com.amin.backend.models.Resume
import java.util.*

object ResumeMapper {
    fun toDto(resume: Resume): ResumeDto =
        ResumeDto(
            id = resume.id,
            uploadedBy = resume.uploadedBy,
            updatedBy = resume.updatedBy,
            sourcePath = resume.sourcePath,
            storagePath = resume.storagePath,
            title = resume.title,
            summary = resume.summary,
            uuid = resume.uuid,
            parsed = resume.parsed,
            contentHash = resume.contentHash
        )

    fun toEntity(dto: ResumeDto): Resume =
        Resume(
            id = dto.id,
            uploadedBy = dto.uploadedBy,
            updatedBy = dto.updatedBy,
            sourcePath = dto.sourcePath,
            storagePath = dto.storagePath,
            title = dto.title,
            summary = dto.summary,
            uuid = dto.uuid ?: UUID.randomUUID(),
            parsed = dto.parsed,
            contentHash = dto.contentHash
        )
}