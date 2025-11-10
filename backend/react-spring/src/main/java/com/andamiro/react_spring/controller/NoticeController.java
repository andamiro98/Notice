package com.andamiro.react_spring.controller;

import com.andamiro.react_spring.model.Notice;
import com.andamiro.react_spring.model.User;
import com.andamiro.react_spring.service.NoticeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private AuthController authController;

    @GetMapping
    public List<Notice> getAllNotice() {
        return noticeService.getAllNotices();
    }

    @GetMapping("/{id}")
    public Optional<Notice> getNoticeById(@PathVariable("id") Integer id) {
        return noticeService.getNoticeById(id);
    }

    @PostMapping
    public Notice createNotice(@Valid @RequestBody Notice notice) {
        return noticeService.createNotice(notice);
    }

    @DeleteMapping("/{id}")
    // @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    public void deleteNoticeById(@PathVariable("id") Integer id) {
        // id : 게시물ID
        // 게시물 id를 통해 사용자 user.getNickname()과 게시글 nickname 비교하여 같을 경우 삭제
        // if( notice.getNickname().equals(user.getNickname())){}
        noticeService.deleteNoticeById(id);

    }

    @PutMapping("/{id}")
    public Notice updateNotice(@Valid @RequestBody Notice notice, @PathVariable("id") Integer id) {
        return noticeService.updateNotice(id, notice);
    }

}
