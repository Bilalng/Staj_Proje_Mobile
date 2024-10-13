package com.spring.SpringbootProject.Repository;

import com.spring.SpringbootProject.Table.Malzeme;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MalzemeRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<String> save(Malzeme malzeme) {
        String sql = "INSERT INTO MALZEME_TBL (MLZ_KODU,MLZ_ADI,OPER,ISLEM_ZAMANI) VALUES (?, ?,?,?)";
        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, malzeme.getMlzKodu());
            ps.setString(2, malzeme.getMlzName());
            ps.setInt(3, malzeme.getOper());
            ps.setString(4, malzeme.getIslemTarihi());
            System.out.println(malzeme.getMlzKodu());
            System.out.println(malzeme.getMlzName());
            System.out.println(malzeme.getOper());
            System.out.println(malzeme.getIslemTarihi());
            return ps;

        });
        if (rows > 0) {
            return List.of("Added Successfully");
        }
        return List.of("Not Added Successfully");
    }

    public List<Malzeme> getAll() {
        String sql = " SELECT * FROM MALZEME_TBL ";
        return jdbcTemplate.query(sql, (rs, rowNumber) -> {
            Malzeme malzeme = new Malzeme();
            malzeme.setMlzId(rs.getInt("MLZ_ID"));
            malzeme.setMlzKodu(rs.getString("MLZ_KODU"));
            malzeme.setMlzName(rs.getString("MLZ_ADI"));
            malzeme.setOper(rs.getInt("OPER"));
            malzeme.setIslemTarihi(rs.getString("ISLEM_ZAMANI"));
            return malzeme;
        });
    }

    public List<String> update(Integer id,Malzeme malzeme) {
        String sql = "UPDATE MALZEME_TBL SET MLZ_KODU = ?, MLZ_ADI = ?, OPER = ?, ISLEM_ZAMANI = ? WHERE MLZ_ID = ? ";

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, malzeme.getMlzKodu().toUpperCase());
            ps.setString(2, malzeme.getMlzName().toUpperCase());
            ps.setInt(3, malzeme.getOper());
            ps.setString(4, malzeme.getIslemTarihi());
            ps.setInt(5, id);
            return ps;
        });
        if (rows > 0) {
            return List.of("Updated");
        }
        return List.of("Employee Can not Updated Succesfully");
    }

    public List<String> delete(Integer id){
        String sql = "DELETE FROM MALZEME_TBL WHERE MLZ_ID=?";
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
        List<String> deletedMalzeme = new ArrayList<>();
        for(int i : id) {
            String sql = "DELETE FROM MALZEME_TBL WHERE MLZ_ID=?";
            try {
                int rows = jdbcTemplate.update(connection -> {
                    PreparedStatement ps = connection.prepareStatement(sql);
                    ps.setInt(1, i);
                    return ps;
                });
                if (rows > 0) {
                    Integer num = i;

                    deletedMalzeme.add(num.toString());
                } else {
                    deletedMalzeme.add("0");
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
                deletedMalzeme.add("0");
            }
        }
        return deletedMalzeme;
    }
}

