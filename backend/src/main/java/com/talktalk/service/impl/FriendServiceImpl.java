package com.talktalk.service.impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.talktalk.dto.response.FriendResponse;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.model.entity.Friend;
import com.talktalk.model.entity.User;
import com.talktalk.repository.jpa.FriendRepository;
import com.talktalk.service.FriendService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class FriendServiceImpl implements FriendService {

    FriendRepository friendRepository;

    @Override
    public void createFriend(User userA, User userB) {
        if (friendRepository.existsByUserA_IdAndUserB_Id(userA.getId(), userB.getId())) {
            throw new AppException(ErrorCode.FRIEND_ALREADY_EXIST);
        }

        friendRepository.save(Friend.builder()
                .userA(userA)
                .userB(userB)
                .build());
    }

    @Override
    public void unfriend(Long userId, Long friendUserId) {

        if (!friendRepository.existsByUserA_IdAndUserB_Id(userId, friendUserId)) {
            throw new AppException(ErrorCode.FRIEND_NOT_FOUND);
        }

        friendRepository.deleteByUserAIdAndUserBId(userId, friendUserId);
    }

    @Override
    public List<FriendResponse> getFriends(Long userId) {
        return friendRepository.getFriends(userId)
                .stream()
                .map(friend -> {
                    boolean isUserA = friend.getUserA().getId().equals(userId);
                    User friendUser = isUserA ? friend.getUserB() : friend.getUserA();

                    return FriendResponse.builder()
                            .id(friendUser.getId())
                            .userName(friendUser.getUserName())
                            .email(friendUser.getEmail())
                            .avatar(friendUser.getAvatar())
                            .createdAt(friend.getCreatedAt())
                            .build();
                })
                .toList();
    }

}
