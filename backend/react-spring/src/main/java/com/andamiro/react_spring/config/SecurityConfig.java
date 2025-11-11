package com.andamiro.react_spring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration // @Component 스프링 컨테이너에 been(자바객체)으로 등록 + 인증(로그인과정)과 인가
@EnableWebSecurity
public class SecurityConfig {

    @Bean()
    public PasswordEncoder passwordEncoder() {
     return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain springSecurityfilterChain(HttpSecurity http) throws Exception {
        http.csrf(AbstractHttpConfigurer::disable) //http.csrf(csrf -> csrf.disable())
                .cors(cors -> {})
        // CSRF(Cross-Site Request Forgery) 공격 방지 기능
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",
                                "/index.html",
                                "/static/**",
                                "/assets/**",
                                "/favicon.ico"
                        ).permitAll()

                        .requestMatchers(
                                "/api/auth/signup",
                                "/api/auth/signin",
                                "/api/auth/user",
                                "/api/auth/logout",
                                "/api/auth/refresh"
                        ).permitAll()

                        .requestMatchers(
                                "/api/notice",
                                "/api/notice/{id}"
                        ).permitAll()

                        .requestMatchers(
                                "/api/notice/create",
                                "/api/notice/update/**",
                                "/api/notice/delete/**"
                        ).hasAnyRole("ADMIN", "MANAGER","MEMBER")

                        .anyRequest().authenticated() // 그 외 요청은 인증 필요


                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        // STATELESS 서버가 클라이언트의 상태를 저장하지 않음
        // NAVER 이미 존재하는 세션이 있으면 사용
        // IF_REQUIRED 인증이나 권한처리가 필요할때만 세션을 생성


        return http.build();
    }
}
