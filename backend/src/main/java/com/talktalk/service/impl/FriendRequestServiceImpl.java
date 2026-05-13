package com.talktalk.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.talktalk.dto.request.SendFriendRequestRequest;
import com.talktalk.dto.response.FriendRequestResponse;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.exception.enums.FriendRequestStatus;
import com.talktalk.exception.enums.MemberRole;
import com.talktalk.exception.enums.TypeConversation;
import com.talktalk.model.entity.Conversations;
import com.talktalk.model.entity.ConversationsMembers;
import com.talktalk.model.entity.FriendRequest;
import com.talktalk.model.entity.User;
import com.talktalk.repository.jpa.ConversationsMembersRepository;
import com.talktalk.repository.jpa.ConversationsRepository;
import com.talktalk.repository.jpa.FriendRepository;
import com.talktalk.repository.jpa.FriendRequestRepository;
import com.talktalk.repository.jpa.UserRepository;
import com.talktalk.service.FriendRequestService;
import com.talktalk.service.FriendService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Transactional
public class FriendRequestServiceImpl implements FriendRequestService {

    UserRepository userRepository;
    FriendRequestRepository friendRequestRepository;
    FriendRepository friendRepository;
    FriendService friendService;
    ConversationsRepository conversationsRepository;
    ConversationsMembersRepository conversationsMembersRepository;

    @Override
    public FriendRequestResponse sendFriendRequest(Long senderId, SendFriendRequestRequest request) {
        if (Objects.isNull(request) || Objects.isNull(request.getReceiverId())) {
            throw new AppException(ErrorCode.FRIEND_NOT_FOUND);
        }
        if (senderId.equals(request.getReceiverId())) {
            throw new AppException(ErrorCode.SEND_REQUEST_TO_SELF);
        }

        User sender = userRepository.findById(senderId).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        User receiver = userRepository.findById(request.getReceiverId())
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        if (friendRepository.existsByUserA_IdAndUserB_Id(senderId, request.getReceiverId())) {
            throw new AppException(ErrorCode.FRIEND_ALREADY_EXIST);
        }

        if (friendRequestRepository.existsBySender_IdAndReceiver_IdAndStatus(senderId, request.getReceiverId(),
                FriendRequestStatus.PENDING)) {
            throw new AppException(ErrorCode.FRIEND_REQUEST_ALREADY_SENT);
        }

        FriendRequest friendRequest = FriendRequest.builder()
                .sender(sender)
                .receiver(receiver)
                .message(request.getMessage())
                .status(FriendRequestStatus.PENDING)
                .build();
        friendRequest = saveFriendRequest(friendRequest);

        return toFriendRequestResponse(friendRequest);
    }

    @Override
    public FriendRequestResponse acceptFriendRequest(Long requestId, Long userId) {
        FriendRequest friendRequest = processFriendRequest(requestId, FriendRequestStatus.ACCEPTED);

        validateReceiver(friendRequest, userId);

        friendService.createFriend(friendRequest.getSender(), friendRequest.getReceiver());

        findOrCreatePrivateConversation(friendRequest.getSender(), friendRequest.getReceiver());

        return toFriendRequestResponse(friendRequest);
    }

    @Override
    public FriendRequestResponse rejectFriendRequest(Long requestId, Long userId) {

        FriendRequest friendRequest = processFriendRequest(requestId, FriendRequestStatus.REJECTED);

        validateReceiver(friendRequest, userId);

        return toFriendRequestResponse(friendRequest);
    }

    @Override
    public FriendRequestResponse cancelFriendRequest(Long requestId, Long userId) {

        FriendRequest friendRequest = processFriendRequest(requestId, FriendRequestStatus.CANCELLED);

        validateSender(friendRequest, userId);

        return toFriendRequestResponse(friendRequest);
    }

    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public List<FriendRequestResponse> getReceivedRequests(Long userId) {
        return friendRequestRepository.findByReceiver_IdAndStatus(userId, FriendRequestStatus.PENDING)
                .stream()
                .map(this::toFriendRequestResponse)
                .toList();
    }

    @Override
    public List<FriendRequestResponse> getSentRequests(Long userId) {
        return friendRequestRepository.findBySender_IdAndStatus(userId, FriendRequestStatus.PENDING)
                .stream()
                .map(this::toFriendRequestResponse)
                .toList();
    }

    private FriendRequest saveFriendRequest(FriendRequest friendRequest) {
        return friendRequestRepository.save(friendRequest);
    }

    private FriendRequestResponse toFriendRequestResponse(FriendRequest friendRequest) {
        return FriendRequestResponse.builder()
                .id(friendRequest.getId())
                .senderId(friendRequest.getSender().getId())
                .senderName(friendRequest.getSender().getUserName())
                .senderAvatar(friendRequest.getSender().getAvatar())
                .receiverId(friendRequest.getReceiver().getId())
                .receiverName(friendRequest.getReceiver().getUserName())
                .receiverAvatar(friendRequest.getReceiver().getAvatar())
                .message(friendRequest.getMessage())
                .status(friendRequest.getStatus())
                .createdAt(friendRequest.getCreatedAt())
                .updatedAt(friendRequest.getUpdatedAt())
                .build();
    }

    private void findOrCreatePrivateConversation(User userA, User userB) {
        boolean conversationExists = conversationsMembersRepository.findAllByUserId(userA.getId())
                .stream()
                .anyMatch(cm -> {
                    Conversations conv = cm.getConversations();
                    if (conv.getType() != TypeConversation.PRIVATE) {
                        return false;
                    }
                    return conversationsMembersRepository.findAllByUserId(userB.getId())
                            .stream()
                            .anyMatch(cm2 -> cm2.getConversations().getId().equals(conv.getId()));
                });

        if (!conversationExists) {
            Conversations conversation = Conversations.builder()
                    .type(TypeConversation.PRIVATE)
                    .title(null)
                    .avatar(null)
                    .lastMessage(null)
                    .lastMessageAt(LocalDateTime.now())
                    .build();
            conversation = conversationsRepository.save(conversation);

            ConversationsMembers memberA = ConversationsMembers.builder()
                    .conversations(conversation)
                    .user(userA)
                    .role(MemberRole.MEMBER)
                    .joinedAt(LocalDateTime.now())
                    .build();
            conversationsMembersRepository.save(memberA);

            ConversationsMembers memberB = ConversationsMembers.builder()
                    .conversations(conversation)
                    .user(userB)
                    .role(MemberRole.MEMBER)
                    .joinedAt(LocalDateTime.now())
                    .build();
            conversationsMembersRepository.save(memberB);
        }
    }

    private FriendRequest processFriendRequest(Long requestId, FriendRequestStatus newStatus) {

        FriendRequest friendRequest = friendRequestRepository.findById(requestId)
                .orElseThrow(() -> new AppException(ErrorCode.FRIEND_REQUEST_NOT_FOUND));

        if (friendRequest.getStatus() != FriendRequestStatus.PENDING) {
            throw new AppException(ErrorCode.FRIEND_REQUEST_ALREADY_PROCESSED);
        }

        friendRequest.setStatus(newStatus);

        return saveFriendRequest(friendRequest);
    }

    private void validateReceiver(FriendRequest request, Long userId) {

        if (!request.getReceiver().getId().equals(userId)) {
            throw new AppException(ErrorCode.FRIEND_REQUEST_NOT_BELONG_TO_USER);
        }
    }

    private void validateSender(FriendRequest request, Long userId) {

        if (!request.getSender().getId().equals(userId)) {
            throw new AppException(ErrorCode.FRIEND_REQUEST_NOT_BELONG_TO_USER);
        }
    }
}
