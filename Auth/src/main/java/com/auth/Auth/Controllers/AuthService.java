package com.auth.Auth.Controllers;

import com.auth.Auth.Models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuthService {
    @Autowired
    private final AuthDAO authDAO;

    public AuthService(AuthDAO authDAO) {
        this.authDAO = authDAO;
    }

    public List<String> register(User user) {
        return authDAO.register(user);
    }

    public List<String> login(User user) {
        return authDAO.login(user);
    }

    public String getUser(String email) {
        return authDAO.getUser(email);
    }
}
