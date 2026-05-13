package com.talktalk.service.impl;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.talktalk.dto.response.AttachmentResponse;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.exception.enums.FileCategory;
import com.talktalk.mapper.AttachmentMapper;
import com.talktalk.model.document.Attachment;
import com.talktalk.service.CloudinaryUploadService;
import com.talktalk.service.UploadFileService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class UploadFileServiceImpl implements UploadFileService {

    CloudinaryUploadService cloudinaryUploadService;
    AttachmentMapper attachmentMapper;

    @Override
    public AttachmentResponse uploadFile(MultipartFile file) {
        try {
            FileCategory category = detectType(file);
            LocalDateTime now = LocalDateTime.now();

            Attachment attachment = cloudinaryUploadService.uploadToCloudinary(file, category, now);

            return attachmentMapper.toAttachmentResponse(attachment);
        } catch (Exception e) {
            log.error("Upload failed for file: {}", file.getOriginalFilename(), e);
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        }
    }

    public FileCategory detectType(MultipartFile file) {
        String type = file.getContentType();

        if (type == null) {
            return FileCategory.FILE;
        }

        if (type.startsWith("image")) {
            return FileCategory.IMAGE;
        }
        if (type.startsWith("video")) {
            return FileCategory.VIDEO;
        }

        return FileCategory.FILE;
    }
}
