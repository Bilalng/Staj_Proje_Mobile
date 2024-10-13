package com.spring.SpringbootProject.Service;

import com.spring.SpringbootProject.Repository.MalzemeHareketRepository;
import com.spring.SpringbootProject.Table.Malzeme;
import com.spring.SpringbootProject.Table.MalzemeHareket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import redis.clients.jedis.Jedis;

import java.util.List;

@Service
public class MalzemeHareketService {

    Jedis jedis = new Jedis("localhost" , 6379);


    @Autowired
    private MalzemeHareketRepository mlzHareketRp;

    public List<MalzemeHareket> getAll() {
        return mlzHareketRp.getAll();
    }

    public List<String> save(MalzemeHareket movement,String token) {
        String[] values = token.split(",");
        String originalToken = jedis.get(values[0]);
        if(!originalToken.equals(values[1])){
            return null;
        }
        return mlzHareketRp.save(movement);
    }

    public List<String> update(MalzemeHareket movement, int id,String token) {
        String[] values = token.split(",");
        String originalToken = jedis.get(values[0]);
        if(!originalToken.equals(values[1])){
            return null;
        }
        return mlzHareketRp.update(id, movement);
    }

    public List<String> delete(int id,String token) {
        String[] values = token.split(",");
        String originalToken = jedis.get(values[0]);
        if(!originalToken.equals(values[1])){
            return null;
        }
        return mlzHareketRp.delete(id);
    }

    public List<String> deleteAll(int[] id,String token) {
        String[] values = token.split(",");
        String originalToken = jedis.get(values[0]);
        if(!originalToken.equals(values[1])){
            return null;
        }
        return mlzHareketRp.deleteAll(id);
    }


}
