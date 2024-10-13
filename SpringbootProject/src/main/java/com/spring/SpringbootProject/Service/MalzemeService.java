package com.spring.SpringbootProject.Service;


import com.spring.SpringbootProject.Repository.MalzemeRepository;
import com.spring.SpringbootProject.Table.Malzeme;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

import java.util.List;

@Service
public class MalzemeService {

    Jedis jedis = new Jedis("localhost" , 6379);


    @Autowired
    private MalzemeRepository mlzrepo;

    public List<Malzeme> getAll() {
        return mlzrepo.getAll();
    }

    public List<String> save(Malzeme material,String token) {
        String[] values = token.split(",");
        String originalToken = jedis.get(values[0]);
        if(!originalToken.equals(values[1])){
            return null;
        }
        return mlzrepo.save(material);
    }

    public List<String> update(Malzeme material, int id,String token) {
        String[] values = token.split(",");
        String originalToken = jedis.get(values[0]);
        if(!originalToken.equals(values[1])){
            return null;
        }
        return mlzrepo.update(id , material);
    }

    public List<String> delete(int id,String token) {
        String[] values = token.split(",");
        String originalToken = jedis.get(values[0]);
        if(!originalToken.equals(values[1])){
            return null;
        }
        return mlzrepo.delete(id);
    }

    public List<String> deleteAll(int[] id,String token) {
        String[] values = token.split(",");
        String originalToken = jedis.get(values[0]);
        if(!originalToken.equals(values[1])){
            return null;
        }
        return mlzrepo.deleteAll(id);
    }
}