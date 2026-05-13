package com.talktalk.service;

import java.util.List;

import com.talktalk.dto.response.FriendResponse;
import com.talktalk.model.entity.User;

public interface FriendService {

    void createFriend(User userA, User userB);

    void unfriend(Long userId, Long friendUserId);

    List<FriendResponse> getFriends(Long userId);
}
