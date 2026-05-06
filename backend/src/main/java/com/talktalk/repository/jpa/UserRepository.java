package com.talktalk.repository.jpa;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.talktalk.model.entity.User;

import org.springframework.data.repository.query.Param;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    @Query("SELECT u FROM User u WHERE u.userName LIKE CONCAT('%', :keyword, '%') AND u.id <> :excludeUserId")
    List<User> searchUsersByKeyword(@Param("keyword") String keyword, @Param("excludeUserId") Long excludeUserId);
}
