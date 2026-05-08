package com.talktalk.service;

import org.springframework.web.multipart.MultipartFile;

import com.talktalk.dto.response.AttachmentResponse;

public interface UploadFileService {
    AttachmentResponse uploadFile(MultipartFile file);
}
