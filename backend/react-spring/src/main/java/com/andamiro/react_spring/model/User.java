package com.andamiro.react_spring.model;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 파라미터가 없는 기본 생성자
public class User {

    @Id // PRIMARY KEY
    @GeneratedValue(strategy = GenerationType.IDENTITY) // AUTOINCREMENT
    private Long id;

    @Column(unique = true,nullable = false)
    @jakarta.validation.constraints.Email
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(unique = true,nullable = false)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;


    @PrePersist // 기본값
    protected void onCreate() {
        if (this.role == null){
            this.role = Role.MEMBER;
        }
    }

}

