package com.talktalk.repository.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.talktalk.exception.enums.FriendRequestStatus;
import com.talktalk.model.entity.FriendRequest;

public interface FriendRequestRepository extends JpaRepository<FriendRequest, Long> {
    Optional<FriendRequest> findBySender_IdAndReceiver_Id(Long senderId, Long receiverId);

    Optional<FriendRequest> findBySender_IdAndReceiver_IdAndStatus(Long senderId, Long receiverId, FriendRequestStatus status);

    List<FriendRequest> findByReceiver_IdAndStatus(Long receiverId, FriendRequestStatus status);

    List<FriendRequest> findBySender_IdAndStatus(Long senderId, FriendRequestStatus status);

    boolean existsBySender_IdAndReceiver_IdAndStatus(Long senderId, Long receiverId, FriendRequestStatus status);

    boolean existsBySender_IdAndReceiver_Id(Long senderId, Long receiverId);
}
