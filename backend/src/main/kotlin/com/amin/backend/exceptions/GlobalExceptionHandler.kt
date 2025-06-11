package com.amin.backend.exceptions

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(Exception::class)
    fun handleAll(ex: Exception): ResponseEntity<String> {
        // Log stack trace for debugging
        ex.printStackTrace()
        return ResponseEntity.status(500).body("Exception: ${ex::class.simpleName} - ${ex.message}")
    }
}