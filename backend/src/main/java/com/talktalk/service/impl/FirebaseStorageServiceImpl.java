package com.talktalk.service.impl;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.google.cloud.storage.Bucket;
import com.google.firebase.cloud.StorageClient;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.model.document.Attachment;
import com.talktalk.service.FirebaseStorageService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FirebaseStorageServiceImpl implements FirebaseStorageService {

    @Override
    public Attachment uploadToFirebase(MultipartFile file, LocalDateTime now) {
        try {
            String url = uploadFile(file);
            Attachment attachment = Attachment.builder()
                    .url(url)
                    .fileName(file.getOriginalFilename())
                    .contentType(file.getContentType())
                    .size(file.getSize())
                    .publicId(null)
                    .build();
            attachment.setCreatedAt(now);
            attachment.setUpdatedAt(now);
            return attachment;
        } catch (IllegalStateException e) {
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        }
    }

    public String uploadFile(MultipartFile file) throws IllegalStateException {
        try {
            Bucket bucket = StorageClient.getInstance().bucket();

            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            String blobPath = "chat-app/files/" + fileName;

            bucket.create(blobPath, file.getBytes(), file.getContentType());

            return String.format("https://storage.googleapis.com/%s/%s", bucket.getName(), blobPath);
        } catch (IllegalStateException e) {
            log.error("Firebase not initialized. Check FirebaseConfig and service account file.", e);
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        } catch (IOException e) {
            log.error("Firebase upload failed for file: {}", file.getOriginalFilename(), e);
            throw new AppException(ErrorCode.UPLOAD_FAILED);
        }
    }
}
