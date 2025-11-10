package com.andamiro.react_spring.repository;

import com.andamiro.react_spring.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NoticeRepository extends JpaRepository<Notice,Integer> {


}
