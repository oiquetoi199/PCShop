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


    /** Tạo mã JWT chứa thông tin người dùng và thời hạn sử dụng. */
    public String generateToken(String username) {
        // các thông tin chứa trong token
        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(key)
                .compact(); // sinh chuỗi
    }

    /** Trích xuất tên đăng nhập từ mã JWT. */
    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    /** Kiểm tra mã JWT đã hết hạn hay chưa. */
    public boolean isTokenExpired(String token) {
        return getExpirationDateFromToken(token).before(new Date());
    }
    /** Lấy thời điểm hết hạn được lưu trong mã JWT. */
    private Date getExpirationDateFromToken(String token) {
        return getClaimFromToken(token, Claims::getExpiration);
    }

    /** Trích xuất một thông tin cụ thể từ phần claim của mã JWT. */
    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claimsResolver.apply(claims);
    }
}