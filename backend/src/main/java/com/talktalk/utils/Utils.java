package com.talktalk.utils;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.talktalk.dto.response.UserResponse;
import com.talktalk.service.UserService;

@Component
public class Utils {

    @Autowired
    UserService userService;

    public static final String ONLINE_USERS_KEY = "users:online";

    public UserResponse getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        UserResponse user = userService.findByEmail(email);
        return user;
    }

    public Long getUserIdFromPrincipal(Principal principal) {
        String email = principal.getName();
        return userService.findByEmailForSocket(email).getId();
    }
}
