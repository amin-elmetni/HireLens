package com.amin.backend.config.security

import com.amin.backend.repositories.UserRepository
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthenticationFilter(
    private val jwtService: JwtService,
    private val userRepository: UserRepository
) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader("Authorization")
        val jwt = authHeader?.takeIf { it.startsWith("Bearer ") }?.substring(7)

        if (jwt != null && SecurityContextHolder.getContext().authentication == null) {
            val userEmail = jwtService.extractEmail(jwt)
            val user = userRepository.findByEmail(userEmail).orElse(null)

            if (user != null && jwtService.isTokenValid(jwt, user)) {
                val authToken = UsernamePasswordAuthenticationToken(user, null, emptyList())
                authToken.details = WebAuthenticationDetailsSource().buildDetails(request)
                SecurityContextHolder.getContext().authentication = authToken
            }
        }

        filterChain.doFilter(request, response)
    }
}
