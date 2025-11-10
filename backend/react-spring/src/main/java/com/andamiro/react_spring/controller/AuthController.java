package com.andamiro.react_spring.controller;

import com.andamiro.react_spring.model.User;
import com.andamiro.react_spring.repository.UserRepository;
import com.andamiro.react_spring.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // RequestBody
    // RequestParm
    // PathVariable

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 회원가입
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody User user) {
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("UserEmail is already exists"); // 409
        }
        if(userRepository.findByNickname(user.getNickname()).isPresent()){
            return ResponseEntity.status(HttpStatus.CONFLICT).body("UserNickname is already exists"); // 409

        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user); // JPA

        return ResponseEntity.ok().body((Map.of(
                "success", true,
                "message", "signUp Success"
        )));
    }


    /**
     * 로그인
     */
    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody User user, HttpServletResponse response) {

        User existingUser = userRepository.findByEmail(
                user.getEmail()).orElseThrow(()->new RuntimeException("유저없음"));

        if(passwordEncoder.matches(user.getPassword(), existingUser.getPassword())) {
            // Token 생성
            String accessToken = jwtUtil.generateAccessToken(
                    existingUser.getEmail(),
                    existingUser.getRole().toString());

            String refreshToken = jwtUtil.generateRefreshToken(
                    existingUser.getEmail(),
                    existingUser.getRole().toString());

            ResponseCookie accessCookie = ResponseCookie.from("jwt", accessToken)
                    .httpOnly(true)
                    .secure(false) // https => true
                    .sameSite("Lax") // Lax, Strict, None
                    .path("/")
                    .maxAge(60*60) // 1시간
                    .build();
            response.addHeader("Set-Cookie", accessCookie.toString());

            ResponseCookie refreshCookie = ResponseCookie.from("refreshToken", refreshToken)
                    .httpOnly(true)
                    .secure(false) // https => true
                    .sameSite("Lax") // Lax, Strict, None
                    .path("/")
                    .maxAge(1*24*60*60) // 1일
                    .build();
            response.addHeader("Set-Cookie", refreshCookie.toString());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "signIn Success"
            ));

        }else{
            throw new RuntimeException("로그인 실패");
        }
    }

    /**
     * 사용자 정보
     */
    @GetMapping("/user")
    public ResponseEntity<?> getMe(HttpServletRequest request) {

        String token = null;
        if(request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if (cookie.getName().equals("jwt")) {
                    token = cookie.getValue();
                    break;
                }
            }
            if (token == null || !jwtUtil.isTokenValid(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 정보 없음");
            }

            String email = jwtUtil.getEmailFromToken(token);
            User user = userRepository.findByEmail(email).orElse(null);

            if(user == null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 정보 없음");
            }

            Map < String, Object > userInfo = new HashMap<>();
            userInfo.put("id", user.getId());
            userInfo.put("email", user.getEmail());
            userInfo.put("role", user.getRole());
            userInfo.put("nickname", user.getNickname());
            return ResponseEntity.ok(userInfo);
        }

        throw new RuntimeException("조회 실패");
    }


    @PostMapping("/logout")
    public ResponseEntity<?> signOut(HttpServletResponse response) {

        ResponseCookie cookie = ResponseCookie.from("jwt", "")
                .httpOnly(true)
                .secure(false) // https => true
                .sameSite("Lax") // Lax, Strict, None
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
        return ResponseEntity.ok("로그아웃");
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(HttpServletResponse response, HttpServletRequest request) {

        String refreshToken = null;

        if(request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshToken != null || jwtUtil.isTokenValid(refreshToken)) {
            String email = jwtUtil.getEmailFromToken(refreshToken);
            User user = userRepository.findByEmail(email).orElse(null);

            if(user != null){
                String newAccessToken = jwtUtil.generateAccessToken(user.getEmail(), user.getRole().toString());
                String newRefreshToken = jwtUtil.generateRefreshToken(user.getEmail(), user.getRole().toString());

                ResponseCookie accessCookie = ResponseCookie.from("jwt", newAccessToken)
                        .httpOnly(true)
                        .secure(false) // https => true
                        .sameSite("Lax") // Lax, Strict, None
                        .path("/")
                        .maxAge(60*60) // 1시간
                        .build();
                response.addHeader("Set-Cookie", accessCookie.toString());

                ResponseCookie responseCookie = ResponseCookie.from("refreshToken", newRefreshToken)
                        .httpOnly(true)
                        .secure(false) // https => true
                        .sameSite("Lax") // Lax, Strict, None
                        .path("/")
                        .maxAge(1*24*60*60) // 1일
                        .build();
                response.addHeader("Set-Cookie", responseCookie.toString());

                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Token Refresh Success"));

            }else {
                throw new RuntimeException("Response Refresh fail");
            }

        }else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }
}



