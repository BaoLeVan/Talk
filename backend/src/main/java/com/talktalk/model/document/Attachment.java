package com.talktalk.model.document;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.data.mongodb.core.mapping.Document;

import com.talktalk.model.entity.BaseEntity;

@Document(collection = "attachments")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Attachment extends BaseEntity {
    String url;
    String fileName;
    String contentType; // image/png, video/mp4
    Long size;
    String thumbnail;
}
