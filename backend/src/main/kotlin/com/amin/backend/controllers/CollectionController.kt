package com.amin.backend.controllers

import com.amin.backend.dtos.CollectionDto
import com.amin.backend.services.CollectionService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/collections")
class CollectionController(private val collectionService: CollectionService) {

    @PostMapping
    fun create(@RequestBody dto: CollectionDto): CollectionDto =
        collectionService.createCollection(dto)

    @PutMapping
    fun update(@RequestBody dto: CollectionDto): CollectionDto =
        collectionService.updateCollection(dto)

    @GetMapping("/user/{userId}")
    fun getUserCollections(@PathVariable userId: Long): List<CollectionDto> =
        collectionService.getUserCollections(userId)

    @GetMapping("/public")
    fun getPublicCollections(): List<CollectionDto> =
        collectionService.getPublicCollections()

    @GetMapping("/public/user/{userId}")
    fun getUserPublicCollections(@PathVariable userId: Long): List<CollectionDto> =
        collectionService.getUserPublicCollections(userId)

    @DeleteMapping("/{id}")
    fun delete(@PathVariable id: Long) =
        collectionService.deleteCollection(id)
}
