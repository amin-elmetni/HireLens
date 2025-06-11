package com.amin.backend.exceptions

import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(DuplicateCollectionNameException::class)
    fun handleDuplicateName(ex: DuplicateCollectionNameException): ResponseEntity<String> {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.message)
    }

    @ExceptionHandler(Exception::class)
    fun handleAll(ex: Exception): ResponseEntity<String> {
        ex.printStackTrace()
        return ResponseEntity.status(500).body("Exception: ${ex::class.simpleName} - ${ex.message}")
    }
}