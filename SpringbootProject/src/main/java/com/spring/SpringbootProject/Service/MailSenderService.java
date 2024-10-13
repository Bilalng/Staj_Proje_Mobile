package com.spring.SpringbootProject.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class MailSenderService {

    private final JavaMailSender mailSender;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    public MailSenderService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public boolean sendMail(String to, String subject, String body) {
        String url = "http://127.0.0.1:8081/auth/user/" + to;

        HttpEntity<String> request = new HttpEntity<>(to);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        if (response.getBody() != null) {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText("Your New Password : " + response.getBody());
            mailSender.send(message);
            return true;
        } else {
            return false;
        }
    }

}
