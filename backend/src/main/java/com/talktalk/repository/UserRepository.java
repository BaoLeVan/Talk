package com.talktalk.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.talktalk.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
