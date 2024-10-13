package com.spring.SpringbootProject.Repository;

import com.spring.SpringbootProject.Table.Emplooye;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.*;

@Repository
public class EmployeeRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<String> save(Emplooye employee) {
            String sql = "INSERT INTO EMPLOOYES (EMP_NAME, SALARY) VALUES (?, ?)";
        System.out.println("EMP name ==> " + employee.getEmpName());
        System.out.println("EMP Salary ==> " + employee.getSalary());
            int rows = jdbcTemplate.update(connection -> {
                PreparedStatement ps = connection.prepareStatement(sql);
                ps.setString(1, employee.getEmpName());
                ps.setInt(2, employee.getSalary());

                return ps;
            });

            if (rows > 0) {
                return List.of("Added Successfully");
            }
            return List.of("Not Added Successfully");
        }


    public List<Emplooye> getAll() {
        String sql = "SELECT * FROM EMPLOOYES";
        return jdbcTemplate.query(sql, (rs, rowNumber) -> {
            Emplooye employee = new Emplooye();
            employee.setEmpId(rs.getInt("EMP_ID"));
            employee.setEmpName(rs.getString("EMP_NAME"));
            employee.setSalary(rs.getInt("SALARY"));
            return employee;
        });
    }

    public List<String> update(Integer id, Emplooye employee){
        String sql = "UPDATE EMPLOOYES SET EMP_NAME = ?, SALARY = ? WHERE EMP_ID = ? ";
        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, employee.getEmpName());
            ps.setInt(2, employee.getSalary());
            ps.setInt(3, id);
            return ps;
        });
        if (rows > 0) {
            return List.of("Emplooye Update succesful");
        }
        return List.of("Employee Can not Updated Succesfully");
    }

    public List<String> delete(Integer id){
        String sql = "DELETE FROM EMPLOOYES WHERE EMP_ID=?";
        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setInt(1, id);
            return ps;
        });
        if (rows > 0) {
            return List.of("Deleted Successfully");
        }
        return List.of("Not Deleted Successfully");
    }

    public List<String> deleteAll(int[] id){
        List<String> deletedEmployees = new ArrayList<>();
        for(int i : id) {
            String sql = "DELETE FROM EMPLOOYES WHERE EMP_ID=?";
            try{
                int rows = jdbcTemplate.update(connection -> {
                    PreparedStatement ps = connection.prepareStatement(sql);
                    ps.setInt(1, i);
                    return ps;
                });
                if(rows>0) {
                    Integer num = i;

                    deletedEmployees.add(num.toString());
                }else{
                    deletedEmployees.add("0");
                }
            }catch(Exception e){
                System.out.println(e.getMessage());
                deletedEmployees.add("0");
            }



        }
        return deletedEmployees;
    }
}

