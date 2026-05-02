package com.talktalk.dto.response;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessagePageResponse {
    private List<MessageResponse> messages;
    private LocalDateTime nextCursor;
    private boolean hasNext;
}
