package com.spring.SpringbootProject.Service;

import com.spring.SpringbootProject.Repository.EmployeeRepository;
import com.spring.SpringbootProject.Table.Emplooye;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

import java.util.Arrays;
import java.util.List;

@Service
public class EmplooyeService {

    Jedis jedis = new Jedis("localhost", 6379);


    @Autowired
    private EmployeeRepository emplooyerepository;

    public List<String> save(Emplooye employee, String token) {
        String[] values = token.split(" "); // Token'ı 'Bearer' ve gerçek token olarak ikiye ayır

        if (values.length < 2) {
            System.out.println("Token formatı hatalı: Yeterli eleman yok.");
            return null;
        }

        String email = values[0];
        String tokenValue = values[1];

        System.out.println("Token ==> " + token);
        System.out.println("Email ==> " + email);
        System.out.println("Token Value ==> " + tokenValue);
        String originalToken = jedis.get(email);

        if (originalToken == null) {
            System.out.println("Redis'te anahtar bulunamadı.");
            return null;
        }
        System.out.println("Original token ==> " + originalToken);

        // Token değerini kontrol edin
        if (!originalToken.equals(tokenValue)) {
            return null;
        }
        return emplooyerepository.save(employee);
    }

    public List<Emplooye> getAll() {
        return emplooyerepository.getAll();
    }

    public List<String> update(Emplooye employee, int id, String token) {
        String[] values = token.split(",");
        String originalToken = jedis.get(values[0]);
        if (!originalToken.equals(values[1])) {
            return null;
        }
        return emplooyerepository.update(id, employee);
    }


    public List<String> delete(int id, String token) {
        String[] values = token.split(",");
        String originalToken = jedis.get(values[0]);
        if (!originalToken.equals(values[1])) {
            return null;
        }
        return emplooyerepository.delete(id);
    }


    public List<String> deleteAll(int[] id, String token) {
        String[] values = token.split(",");
        String originalToken = jedis.get(values[0]);
        if (!originalToken.equals(values[1])) {
            return null;
        }
        return emplooyerepository.deleteAll(id);
    }

}