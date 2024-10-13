package com.spring.SpringbootProject.Controller;

import com.spring.SpringbootProject.Service.EmplooyeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.spring.SpringbootProject.Table.Emplooye;

import java.util.List;

@RestController
@RequestMapping("/emplooye")
@CrossOrigin(origins = "*" ,allowedHeaders = "*")
public class EmplooyeController {

    private final EmplooyeService employeeService;

    @Autowired
    public EmplooyeController(EmplooyeService employeeService) {
        this.employeeService = employeeService;
    }

    @GetMapping
    public List<Emplooye> getEmployees() {
        return employeeService.getAll();
    }

    @PostMapping
    public List<String> addEmployee(@RequestBody Emplooye employee,@RequestHeader("Authorization") String token) {
        return employeeService.save(employee,token);
    }

    @PostMapping(path = "/update/{id}")
    public List<String> updateEmployee(@RequestBody Emplooye employee,@PathVariable int id,@RequestHeader("Authorization") String token) {
        return  employeeService.update(employee,id,token);
    }

    @PostMapping(path = "/delete/{id}")
    public List<String> deleteEmployee(@PathVariable int id,@RequestHeader("Authorization") String token) {
        return  employeeService.delete(id,token);
    }

    @PostMapping(path = "/delete/all")
    public List<String> deleteEmployee(@RequestBody int[] id,@RequestHeader("Authorization") String token) {
        return  employeeService.deleteAll(id,token);
    }
}
