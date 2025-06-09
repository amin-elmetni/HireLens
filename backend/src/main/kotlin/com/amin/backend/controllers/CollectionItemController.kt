package com.amin.backend.controllers

import com.amin.backend.dtos.CollectionItemDto
import com.amin.backend.services.CollectionItemService
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/collection-items")
class CollectionItemController(private val service: CollectionItemService) {

    @PostMapping
    fun addItem(@RequestBody dto: CollectionItemDto): CollectionItemDto =
        service.addItem(dto)

    @GetMapping("/collection/{collectionId}")
    fun getItems(@PathVariable collectionId: Long): List<CollectionItemDto> =
        service.getItemsByCollectionId(collectionId)

    @DeleteMapping("/collection/{collectionId}/resume/{resumeId}")
    fun removeItem(@PathVariable collectionId: Long, @PathVariable resumeId: Long) =
        service.removeItem(collectionId, resumeId)
}
