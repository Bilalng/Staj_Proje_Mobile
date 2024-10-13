package com.spring.SpringbootProject.Service;

import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

@Service
public class AuthorizeService {

    public boolean authorize(String token,String email) {
        try{
            System.out.println("Token ==> " + token);
            Jedis jedis = new Jedis("localhost" , 6380);
            jedis.set(email, token);
            jedis.expire(email, 10900);
            return true;
        }catch (Exception e){
            e.printStackTrace();
            return false;
        }
    }
}
