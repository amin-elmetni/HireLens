package com.amin.backend.dtos

import java.util.*

data class ResumeDto(
    val id: Long? = null,
    val uploadedBy: Long? = null,
    val updatedBy: Long? = null,
    val sourcePath: String,
    val storagePath: String,
    val title: String? = null,
    val summary: String? = null,
    val uuid: UUID? = null,
    val parsed: Boolean = false,
    val contentHash: String? = null
)