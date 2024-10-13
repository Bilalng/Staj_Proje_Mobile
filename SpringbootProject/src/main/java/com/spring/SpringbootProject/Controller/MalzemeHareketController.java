package com.spring.SpringbootProject.Controller;

import com.spring.SpringbootProject.Service.MalzemeHareketService;
import com.spring.SpringbootProject.Table.MalzemeHareket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/malzemehareket")
@CrossOrigin(origins = "*" ,allowedHeaders = "*")

public class MalzemeHareketController {

    private final MalzemeHareketService hareketservice;

    @Autowired
    public MalzemeHareketController(MalzemeHareketService hareketservice) {
        this.hareketservice = hareketservice;
    }

    @GetMapping
    public List<MalzemeHareket> getMovements() {
        return hareketservice.getAll();}

    @PostMapping
    public List<String> addMovement(@RequestBody MalzemeHareket movement, @RequestHeader("Authorization") String token) {
        return hareketservice.save(movement,token);
    }

    @PostMapping(path = "/update/{id}")
    public List<String> updateMovement(@RequestBody MalzemeHareket movement, @PathVariable int id,@RequestHeader("Authorization") String token) {
        return  hareketservice.update(movement,id,token);
    }

    @PostMapping(path = "/delete/{id}")
    public List<String> deleteMovement(@PathVariable int id,@RequestHeader("Authorization") String token) {
        return  hareketservice.delete(id,token);
    }

    @PostMapping(path = "/delete/all")
    public List<String> deleteMovement(@RequestBody int[] id,@RequestHeader("Authorization") String token) {
        return  hareketservice.deleteAll(id,token);
    }

}