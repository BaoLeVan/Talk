package com.talktalk.repository.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.talktalk.model.entity.Friend;

public interface FriendRepository extends JpaRepository<Friend, Long> {

    @Query("SELECT EXISTS(SELECT 1 FROM Friend f WHERE (f.userA.id = :userAId AND f.userB.id = :userBId) OR (f.userA.id = :userBId AND f.userB.id = :userAId))")
    boolean existsByUserA_IdAndUserB_Id(Long userAId, Long userBId);

    Optional<Friend> findByUserA_IdAndUserB_Id(Long userAId, Long userBId);

    @Query("SELECT f FROM Friend f WHERE f.userA.id = :userId OR f.userB.id = :userId")
    List<Friend> getFriends(Long userId);

    @Modifying
    @Query("DELETE FROM Friend f WHERE (f.userA.id = :userAId AND f.userB.id = :userBId) OR (f.userA.id = :userBId AND f.userB.id = :userAId)")
    void deleteByUserAIdAndUserBId(Long userAId, Long userBId);
}
