package com.talktalk.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.exception.enums.FileCategory;
import com.talktalk.model.document.Attachment;
import com.talktalk.service.CloudinaryUploadService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class CloudinaryUploadServiceImpl implements CloudinaryUploadService {

    Cloudinary cloudinary;

    @Override
    public Attachment uploadToCloudinary(MultipartFile file, FileCategory category, LocalDateTime now) {
        try {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "chat-app/messages"));
            String url = (String) uploadResult.get("secure_url");
            String format = (String) uploadResult.get("format");
            Long size = ((Number) uploadResult.get("bytes")).longValue();
            String publicId = (String) uploadResult.get("public_id");

            String contentType = file.getContentType();
            if (contentType == null) {
                contentType = category.name().toLowerCase() + "/" + format;
            }

            Attachment attachment = Attachment.builder()
                    .url(url)
                    .fileName(file.getOriginalFilename())
                    .contentType(contentType)
                    .size(size)
                    .publicId(publicId)
                    .build();
            attachment.setCreatedAt(now);
            attachment.setUpdatedAt(now);
            return attachment;
        } catch (IOException e) {
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        }
    }
}
