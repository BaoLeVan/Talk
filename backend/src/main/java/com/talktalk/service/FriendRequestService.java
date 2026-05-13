package com.talktalk.service;

import java.util.List;

import com.talktalk.dto.request.SendFriendRequestRequest;
import com.talktalk.dto.response.FriendRequestResponse;

public interface FriendRequestService {

    FriendRequestResponse sendFriendRequest(Long senderId, SendFriendRequestRequest request);

    FriendRequestResponse acceptFriendRequest(Long requestId, Long userId);

    FriendRequestResponse rejectFriendRequest(Long requestId, Long userId);

    FriendRequestResponse cancelFriendRequest(Long requestId, Long userId);

    List<FriendRequestResponse> getReceivedRequests(Long userId);

    List<FriendRequestResponse> getSentRequests(Long userId);
}
