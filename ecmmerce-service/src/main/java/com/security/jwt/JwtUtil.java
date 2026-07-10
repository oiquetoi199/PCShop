package com.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    // sinh ngẫu nhiên secretKey
    private final SecretKey key = Keys.secretKeyFor(SignatureAlgorithm.HS512);

    // thời hạn token ( lấy ở properties)
    @Value("${jwt.expiration}")
    private long expiration;


    // tạo token
    public String generateToken(String username) {
        // các thông tin chứa trong token
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact(); // sinh chuỗi
    }

    // lấy username từ token
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    // kiểm tra hết hạn
    public boolean isTokenExpired(String token) {
        return getExpirationDateFromToken(token).before(new Date());
    }
    private Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    // đọc jwt
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }
}