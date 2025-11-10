package com.andamiro.react_spring.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {

    @Value("${jwt.accessTokenExpireTime}")
    private Long accessTokenExpireTime; //600000 10분
    @Value("${jwt.refreshTokenExpireTime}")
    private Long refreshTokenExpireTime; //일주일

    private final SecretKey key;

    public JwtUtil(@Value("${jwt.secret}") String secret) {
        if (secret == null || secret.isBlank()) {
            throw new IllegalStateException("jwt.secret is missing");
        }

        byte[] raw = io.jsonwebtoken.io.Decoders.BASE64.decode(secret.trim());
        this.key = io.jsonwebtoken.security.Keys.hmacShaKeyFor(raw);
    }

    public String generateAccessToken(String email, String role) {


        return Jwts.builder()
                .claim("email", email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + accessTokenExpireTime))
                //.claim("iat",new Date().getTime())
                //.claim("exp", new Date(System.currentTimeMillis() + accessTokenExpireTime)) // expiration
                .signWith(key)
                .compact(); // 적용
    }


    public String generateRefreshToken(String email, String role) {
        return Jwts.builder()
                .claim("email", email)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + refreshTokenExpireTime))
                .signWith(key)
                .compact();
    }

    /**
     * jwt 토큰 안에 있는 요소
     */
    private Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(key)  // 서명 검증 키
                .build()
                .parseSignedClaims(token) // 0.13.0
                .getPayload();
                //.setSigningKey(Keys.hmacShaKeyFor(secretKey.getBytes()))
                //.build()
                //.parseClaimsJws(token)
                //.getBody();
    }

    /**
     * jwt토큰을 이용해서 로그인과 로그아웃 기능을 이용 즉, 정보 인증단계
     */
    public Authentication getAuthentication(String token, UserDetails userDetails) {
        return new UsernamePasswordAuthenticationToken(
                userDetails,
                null, // 인증에 사용된 자격 증명 (최초 로그인시 이후에는 필요없기 때문에 null)
                userDetails.getAuthorities() // 유저권한
        );
        // SecurityContext에 등록 (데이터 저장 컨테이너)
    }

    /**
     * JWT 토큰 유효 검증
     */
    public Boolean isTokenValid(String token) {
        try {
            Claims claims = getClaimsFromToken(token);
            long expired = claims.getExpiration().getTime();
            return expired > System.currentTimeMillis();
        }catch (Exception e) {
            return false;
        }
    }

    /**
     * 사용자 이름
     */
    public String getEmailFromToken(String token) {
        return getClaimsFromToken(token).get("email", String.class);
    }

    public String getRoleFromToken(String token) {
        return getClaimsFromToken(token).get("role", String.class);
    }

}
