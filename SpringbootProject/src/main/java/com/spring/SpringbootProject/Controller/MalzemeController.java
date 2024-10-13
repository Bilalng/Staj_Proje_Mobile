package com.spring.SpringbootProject.Controller;


import com.spring.SpringbootProject.Service.MalzemeService;
import com.spring.SpringbootProject.Table.Malzeme;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/malzeme")
@CrossOrigin(origins = "*" ,allowedHeaders = "*")
public class MalzemeController {

    private final MalzemeService mlzservice;

    @Autowired
    public MalzemeController(final MalzemeService mlzservice) {
        this.mlzservice = mlzservice;
    }

    @GetMapping
    public List<Malzeme> getMaterials() {
        return mlzservice.getAll();
    }

    @PostMapping
    public List<String> addMaterial(@RequestBody Malzeme malzeme, @RequestHeader("Authorization") String token) {
        return mlzservice.save(malzeme, token);
    }

    @PostMapping(path = "/update/{id}")
    public List<String> updateMaterial(@RequestBody Malzeme malzeme, @PathVariable int id, @RequestHeader("Authorization") String token) {
        return mlzservice.update(malzeme, id, token);
    }

    @PostMapping(path = "/delete/{id}")
    public List<String> deleteMaterial(@PathVariable int id, @RequestHeader("Authorization") String token) {
        return mlzservice.delete(id, token);
    }

    @PostMapping(path = "/delete/all")
    public List<String> deleteMaterial(@RequestBody int[] id, @RequestHeader("Authorization") String token) {
        return mlzservice.deleteAll(id, token);
    }

}