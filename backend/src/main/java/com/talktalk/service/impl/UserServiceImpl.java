package com.talktalk.service.impl;

import java.util.Objects;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.talktalk.dto.response.UserResponse;
import com.talktalk.exception.AppException;
import com.talktalk.exception.ErrorCode;
import com.talktalk.mapper.UserMapper;
import com.talktalk.model.entity.User;
import com.talktalk.repository.jpa.UserRepository;
import com.talktalk.service.UserService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {

    UserRepository userRepository;
    UserMapper userMapper;

    @Override
    public User save(User user) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    @Override
    public User update(User entity) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'update'");
    }

    @Override
    public void delete(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'delete'");
    }

    @Override
    public User getById(Long id) {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getById'");
    }

    @Override
    public void checkExistEmail(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new AppException(ErrorCode.EMAIL_EXIST);
        }
    }

    @Override
    public void saveUser(User user) {
        if (Objects.isNull(user)) {
            throw new AppException(ErrorCode.USER_EXIST);
        }
        userRepository.save(user);
    }

    @Override
    public void updateVerified(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        user.setIsVerified(true);
        userRepository.save(user);
    }

    @Override
    @PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
    public UserResponse findByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));
        return userMapper.toUserResponse(user);
    }
}
