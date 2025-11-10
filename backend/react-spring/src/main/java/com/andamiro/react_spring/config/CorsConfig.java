package com.andamiro.react_spring.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration // Component + Cors
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.addAllowedOrigin("http://localhost:5173"); // 허용할 클라이언트 도메인
        corsConfiguration.addAllowedMethod("*"); // 모든 HTTP 메서드를 허용 (GET, POST, PUT, DELETE)
        corsConfiguration.addAllowedHeader("*"); // 모든 헤더 사용
        corsConfiguration.setAllowCredentials(true); // 쿠키 cross-origin으로 전달 (쿠키 기반 인증)
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);
        return source;
    }
}
