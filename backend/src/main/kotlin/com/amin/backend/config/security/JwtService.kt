package com.amin.backend.config.security

import com.amin.backend.models.User
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*

@Component
class JwtService(
    @Value("\${jwt.secret}") private val secretKey: String
) {
    //    private val key = Keys.hmacShaKeyFor(secretKey.toByteArray())
    private val key = Keys.hmacShaKeyFor(Base64.getDecoder().decode(secretKey))

    fun generateToken(user: User): String =
        Jwts.builder()
            .setSubject(user.email)
            .claim("role", user.role.name)
            .setIssuedAt(Date())
            .setExpiration(Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24)) // 24h
            .signWith(key, SignatureAlgorithm.HS256)
            .compact()

    fun extractEmail(token: String): String =
        Jwts.parserBuilder().setSigningKey(key).build()
            .parseClaimsJws(token).body.subject

    fun isTokenValid(token: String, user: User): Boolean =
        extractEmail(token) == user.email && !isTokenExpired(token)

    private fun isTokenExpired(token: String): Boolean =
        Jwts.parserBuilder().setSigningKey(key).build()
            .parseClaimsJws(token).body.expiration.before(Date())
}
