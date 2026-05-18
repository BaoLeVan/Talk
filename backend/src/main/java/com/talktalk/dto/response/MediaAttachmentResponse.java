package com.talktalk.dto.response;

import java.time.LocalDateTime;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class MediaAttachmentResponse {
    String messageId;
    String url;
    String fileName;
    String contentType;
    Long size;
    LocalDateTime createdAt;
}
