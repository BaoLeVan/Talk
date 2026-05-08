package com.talktalk.service;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import com.talktalk.model.document.Attachment;

public interface FirebaseStorageService {
    Attachment uploadToFirebase(MultipartFile file, LocalDateTime now) throws Exception;
}
