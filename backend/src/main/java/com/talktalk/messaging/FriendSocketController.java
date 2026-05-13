package com.talktalk.messaging;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.talktalk.dto.request.SendFriendRequestRequest;
import com.talktalk.dto.response.FriendNotificationResponse;
import com.talktalk.dto.response.FriendRequestResponse;
import com.talktalk.dto.response.FriendResponse;
import com.talktalk.service.FriendRequestService;
import com.talktalk.service.FriendService;
import com.talktalk.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;

@Controller
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class FriendSocketController {

    SimpMessagingTemplate messagingTemplate;
    FriendRequestService friendRequestService;
    FriendService friendService;
    UserService userService;

    @MessageMapping("/friend.sendRequest")
    public void sendFriendRequest(@Payload SendFriendRequestRequest request, Principal principal) {
        Long senderId = getUserIdFromPrincipal(principal);
        FriendRequestResponse response = friendRequestService.sendFriendRequest(senderId, request);
        log.info("Friend request sent successfully: {}", response);
        String receiverEmail = userService.getById(request.getReceiverId()).getEmail();
        sendFriendNotification(receiverEmail, "FRIEND_REQUEST_RECEIVED", response, null);
    }

    @MessageMapping("/friend.acceptRequest")
    public void acceptFriendRequest(@Payload Long requestId, Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);
        FriendRequestResponse response = friendRequestService.acceptFriendRequest(requestId, userId);

        String senderEmail = userService.getById(response.getSenderId()).getEmail();
        sendFriendNotification(senderEmail, "FRIEND_REQUEST_ACCEPTED", response, null);
        sendFriendNotification(principal.getName(), "FRIEND_REQUEST_ACCEPTED_BY_ME", response, null);
    }

    @MessageMapping("/friend.rejectRequest")
    public void rejectFriendRequest(@Payload Long requestId, Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);
        FriendRequestResponse response = friendRequestService.rejectFriendRequest(requestId, userId);

        String senderEmail = userService.getById(response.getSenderId()).getEmail();
        sendFriendNotification(senderEmail, "FRIEND_REQUEST_REJECTED", response, null);
    }

    @MessageMapping("/friend.cancelRequest")
    public void cancelFriendRequest(@Payload Long requestId, Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);
        FriendRequestResponse response = friendRequestService.cancelFriendRequest(requestId, userId);

        String receiverEmail = userService.getById(response.getReceiverId()).getEmail();
        sendFriendNotification(receiverEmail, "FRIEND_REQUEST_CANCELLED", response, null);
    }

    @MessageMapping("/friend.unfriend")
    public void unfriend(@Payload Long friendUserId, Principal principal) {
        Long userId = getUserIdFromPrincipal(principal);
        friendService.unfriend(userId, friendUserId);
        sendFriendNotification(principal.getName(), "UNFRIENDED_BY_ME", null, null);
    }

    public void sendFriendNotification(String userEmail, String type, FriendRequestResponse friendRequest,
            FriendResponse friend) {
        FriendNotificationResponse notification = FriendNotificationResponse.builder()
                .type(type)
                .friendRequest(friendRequest)
                .friend(friend)
                .status(friendRequest != null ? friendRequest.getStatus() : null)
                .build();

        messagingTemplate.convertAndSendToUser(userEmail, "/queue/friends", notification);
    }

    private Long getUserIdFromPrincipal(Principal principal) {
        String email = principal.getName();
        return userService.findByEmailForSocket(email).getId();
    }
}
