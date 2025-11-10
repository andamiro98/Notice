package com.andamiro.react_spring.util;


import com.andamiro.react_spring.model.User;
import com.andamiro.react_spring.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
public class JtwFilter extends OncePerRequestFilter {
// OncePerRequestFilter : 모든 HttpServletRequest클래스에서 만든 request객체 중복없이 한번씩만 받도록 설정
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if(StringUtils.hasText(jwt) && jwtUtil.isTokenValid(jwt)){

                String email = jwtUtil.getEmailFromToken(jwt);
                String role = jwtUtil.getRoleFromToken(jwt);

                log.info("email {} role {}", email, role);

                User user = userRepository.findByEmail(email)
                        .orElseThrow(()-> new UsernameNotFoundException("UsernameNotFound"));

                // 유저 권한정보
                List<GrantedAuthority> authories = List.of(
                        new SimpleGrantedAuthority("ROLE_" + user.getRole().toString()));

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                        user.getEmail(), null, authories);

                //authentication 객체 저장
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }catch(Exception e){
            log.error("Exception occurred when processing jwt request!", e);
        }
        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if(StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")){
            log.info("Bearer Token: {}", bearerToken);
            return bearerToken.substring(7);
        }
        return null;
    }
}