package com.auth.Auth.Controllers;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.client.RestTemplate;
import com.auth.Auth.Models.User;

import java.sql.PreparedStatement;
import java.util.List;
import java.util.UUID;

@Repository
public class AuthDAO {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private RestTemplate restTemplate;

    public List<String> register(User user) {
        String sql = "SELECT COUNT(*) FROM USERSS WHERE USER_MAIL_ADRESS = ?";
        Integer count = jdbcTemplate.queryForObject(sql, new Object[]{user.getUsermail()}, Integer.class);

        if (count > 0) {
            return List.of("Email Already Exists");
        }
        System.out.println("ekleme yeri");
        String insertSql = "INSERT INTO USERSS (USER_NAME, USER_SURNAME,USER_PHONE_NUMBER, USER_MAIL_ADRESS, USER_PASSWORD) VALUES (?, ?, ?,?,?)";
        int rows = jdbcTemplate.update(insertSql, user.getUsername(), user.getSurname(), user.getUserphone(), user.getUsermail(), user.getUserpassword());

        if (rows > 0) {
            return List.of("register success");
        } else {
            return List.of("register not success");
        }
    }

    public List<String> login(User user) {
        System.out.println("User mail ==> " + user.getUsermail());
        System.out.println("User password ==> " + user.getUserpassword());
        String sql = "SELECT COUNT(*) FROM USERSS WHERE USER_MAIL_ADRESS = ? AND USER_PASSWORD = ?";
        int rows = jdbcTemplate.update(sql, user.getUsermail(), user.getUserpassword());

        if (rows > 0) {
            String token = UUID.randomUUID().toString();
            String url = "http://localhost:8080/api/authorize/" + user.getUsermail();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", token);
            HttpEntity<User> request = new HttpEntity<>(user, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            System.out.println("Response Body ==> " + response.getBody());
            System.out.println("Token ==> " + token);
            if (response.getBody().equals("true")){
                return List.of("login success", token);
            } else {
                return List.of("login not success");
            }
        } else {
            return List.of("login not success");
        }
    }

    public String getUser(String email) {
        System.out.println("Gelen Email: " + email);
        String sql = "SELECT COUNT(*) FROM USERSS WHERE USER_MAIL_ADRESS = ?";
        try {
            Integer count = jdbcTemplate.queryForObject(sql, new Object[]{email}, Integer.class);
            if (count > 0) {
                String newPassword = UUID.randomUUID().toString();
                try {
                    String updateSql = "UPDATE USER_TABLE SET PASSWORD = ? WHERE EMAIL = ?";
                    int rows = jdbcTemplate.update(connection -> {
                        PreparedStatement ps = connection.prepareStatement(updateSql);
                        ps.setString(1, newPassword);
                        ps.setString(2, email);
                        return ps;
                    });
                } catch (Exception e) {
                    System.out.println(e.getMessage());
                }
                return newPassword;
            }
            return null;
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return null;
        }

    }
}
