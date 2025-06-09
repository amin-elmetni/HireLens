package com.amin.backend.services

import com.amin.backend.dtos.ResumeDto
import com.amin.backend.mappers.ResumeMapper
import com.amin.backend.repositories.ResumeRepository
import org.springframework.stereotype.Service
import java.util.*

@Service
class ResumeService(private val resumeRepository: ResumeRepository) {

    fun getAll(): List<ResumeDto> =
        resumeRepository.findAll().map { ResumeMapper.toDto(it) }

    fun getById(id: Long): ResumeDto? =
        resumeRepository.findById(id).orElse(null)?.let { ResumeMapper.toDto(it) }

    fun getByUuid(uuid: UUID): ResumeDto? =
        resumeRepository.findByUuid(uuid)?.let { ResumeMapper.toDto(it) }

    fun getByContentHash(contentHash: String): ResumeDto? =
        resumeRepository.findByContentHash(contentHash)?.let { ResumeMapper.toDto(it) }

    fun save(dto: ResumeDto): ResumeDto =
        ResumeMapper.toDto(resumeRepository.save(ResumeMapper.toEntity(dto)))

    fun markAsParsed(uuid: UUID) {
        resumeRepository.findByUuid(uuid)?.let {
            resumeRepository.save(it.copy(parsed = true))
        }
    }

    fun existsByContentHash(contentHash: String): Boolean =
        resumeRepository.existsByContentHash(contentHash)
}