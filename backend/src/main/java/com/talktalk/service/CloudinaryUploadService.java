package com.talktalk.service;

import java.time.LocalDateTime;

import org.springframework.web.multipart.MultipartFile;

import com.talktalk.exception.enums.FileCategory;
import com.talktalk.model.document.Attachment;

public interface CloudinaryUploadService {
    Attachment uploadToCloudinary(MultipartFile file, FileCategory category, LocalDateTime now);
}
