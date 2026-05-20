package com.talktalk.model.document;

import java.time.LocalDateTime;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Id;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

@Document(collection = "message_hidden_user")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@CompoundIndex(
        name = "message_user_idx",
        def = "{'messageId': 1, 'userId': 1}",
        unique = true
)
public class MessageHiddenUser {

    @Id
    private String id;

    private String messageId;

    private String userId;

    private LocalDateTime hiddenAt;
}