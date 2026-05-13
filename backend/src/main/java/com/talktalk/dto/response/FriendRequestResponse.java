package com.talktalk.dto.response;

import java.time.LocalDateTime;

import com.talktalk.exception.enums.FriendRequestStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendRequestResponse {
    private Long id;
    private Long senderId;
    private String senderName;
    private String senderAvatar;
    private Long receiverId;
    private String receiverName;
    private String receiverAvatar;
    private String message;
    private FriendRequestStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
