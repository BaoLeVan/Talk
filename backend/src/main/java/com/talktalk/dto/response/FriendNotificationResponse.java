package com.talktalk.dto.response;

import com.talktalk.exception.enums.FriendRequestStatus;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendNotificationResponse {
    private String type;
    private FriendRequestResponse friendRequest;
    private FriendResponse friend;
    private FriendRequestStatus status;
}
