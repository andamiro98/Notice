package com.andamiro.react_spring.service;

import com.andamiro.react_spring.model.Notice;
import com.andamiro.react_spring.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    public List<Notice> getAllNotices(){
        return noticeRepository.findAll();
    }

    public Optional<Notice> getNoticeById(Integer id) {
        return noticeRepository.findById(id);
    }

    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    public Notice updateNotice(Integer id, Notice noticeDetails) {
        Notice notice = noticeRepository.findById(id).orElseThrow();
        notice.setTitle(noticeDetails.getTitle());
        notice.setContent(noticeDetails.getContent());
        notice.setNickname(noticeDetails.getNickname());
        //notice.setCreatedat(noticeDetails.getCreatedat());

        return noticeRepository.save(notice);
    }


    public void deleteNoticeById(Integer id) {
        noticeRepository.deleteById(id);
    }
}
