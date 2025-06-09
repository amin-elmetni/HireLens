package com.amin.backend.controllers

import com.amin.backend.dtos.UserDto
import com.amin.backend.services.UserService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/users")
class UserController(
    private val userService: UserService
) {

    @GetMapping
    fun getAllUsers(): ResponseEntity<List<UserDto>> =
        ResponseEntity.ok(userService.getAllUsers())

    @GetMapping("/{id}")
    fun getUserById(@PathVariable id: Long): ResponseEntity<UserDto> =
        ResponseEntity.ok(userService.getUserById(id))

    @GetMapping("/email/{email}")
    fun getUserByEmail(@PathVariable email: String): ResponseEntity<UserDto> =
        ResponseEntity.ok(userService.getUserByEmail(email))

    @PostMapping
    fun createUser(@RequestBody userDto: UserDto): ResponseEntity<UserDto> =
        ResponseEntity.ok(userService.createUser(userDto))

    @DeleteMapping("/{id}")
    fun deleteUser(@PathVariable id: Long): ResponseEntity<Void> {
        userService.deleteUser(id)
        return ResponseEntity.noContent().build()
    }
}
