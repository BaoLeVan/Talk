package com.talktalk.controller;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.talktalk.dto.response.ApiResponse;
import com.talktalk.dto.response.AttachmentResponse;
import com.talktalk.service.UploadFileService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/api/v1/attachments")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class AttachmentController {

    UploadFileService uploadFileService;

    @PostMapping("/upload")
    public ApiResponse<AttachmentResponse> uploadFile(@RequestParam("file") MultipartFile file) {
        AttachmentResponse response = uploadFileService.uploadFile(file);
        return ApiResponse.<AttachmentResponse>builder()
                .code(HttpStatus.OK.value())
                .message("File uploaded successfully")
                .data(response)
                .build();
    }
}
