package com.auth.Auth.Controllers;

import com.auth.Auth.Models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping(path = "auth/")
@CrossOrigin(origins = "*" , allowedHeaders = "*")
public class AuthController {

    @Autowired
    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping(path = "register")
    public List<String> register(@RequestBody User user){
        return authService.register(user);
    }

    @PostMapping(path = "login")
    public List<String> login(@RequestBody User user){
        return authService.login(user);
    }

    @PostMapping(path = "user/{email}")
    public String getUser(@PathVariable String email){
        return authService.getUser(email);
    }

}
