package com.talktalk.service;

import java.util.List;

import com.talktalk.dto.response.UserResponse;
import com.talktalk.model.entity.User;

public interface UserService extends CrudService<User, Long> {

    void checkExistEmail(String email);

    void saveUser(User user);

    void updateVerified(String email);

    UserResponse findByEmail(String email);

    List<UserResponse> searchUsers(String keyword, Long excludeUserId);

    UserResponse findByEmailForSocket(String email);

    Boolean checkOnline(Long userId);
}
