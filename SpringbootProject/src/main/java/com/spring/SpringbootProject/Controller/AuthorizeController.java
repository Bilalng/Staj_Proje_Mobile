package com.spring.SpringbootProject.Controller;

import com.spring.SpringbootProject.Service.AuthorizeService;
import com.spring.SpringbootProject.Service.MailSenderService;
import com.spring.SpringbootProject.Util.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "api/authorize")
@CrossOrigin(origins = "*" ,allowedHeaders = "*")
public class AuthorizeController {

    @Autowired
    private final AuthorizeService authorizeService;

    @Autowired
    private final MailSenderService mailSenderService;

    public AuthorizeController(AuthorizeService authorizeService, MailSenderService mailSenderService) {
        this.authorizeService = authorizeService;
        this.mailSenderService = mailSenderService;
    }

    @PostMapping(path = "/{email}")
    public boolean authorize(@RequestHeader("Authorization") String token , @PathVariable String email) {
        System.out.println("Token ==> "+ token);
        if(token == null){
            return false;
        }
        return authorizeService.authorize(token,email);
    }

    @PostMapping(path = "/forgot")
    public boolean forgotPassword(@RequestBody Email email) {
        return mailSenderService.sendMail(email.getEmail() ,"Forgot Password" , "New Password");
    }

}
