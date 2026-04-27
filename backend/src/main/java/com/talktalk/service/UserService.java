package com.talktalk.service;

import com.talktalk.model.User;

public interface UserService extends CrudService<User, String> {

    void checkExistEmail(String email);

    void saveUser(User user);

    void updateVerified(String email);

}
