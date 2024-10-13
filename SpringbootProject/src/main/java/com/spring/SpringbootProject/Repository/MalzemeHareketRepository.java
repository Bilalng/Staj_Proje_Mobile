package com.spring.SpringbootProject.Repository;

import com.spring.SpringbootProject.Table.MalzemeHareket;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.ArrayList;
import java.util.List;

@Repository
public class MalzemeHareketRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public List<String> save(MalzemeHareket mlzHrkt) {
        String sql = "INSERT INTO MALZEME_HAREKET_TBL (TARIH,MLZ_KODU,HAREKET_TUR,MIKTAR) VALUES (?, ?,?,?)";
        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, mlzHrkt.getTarih());
            ps.setString(2, mlzHrkt.getMlzKodu());
            ps.setString(3, mlzHrkt.getHareketTur());
            ps.setInt(4, mlzHrkt.getMiktar());
            System.out.println(mlzHrkt.getMlzKodu());
            System.out.println(mlzHrkt.getMiktar());
            System.out.println(mlzHrkt.getHareketTur());
            System.out.println(mlzHrkt.getTarih());
            return ps;

        });
        if (rows > 0) {
            return List.of("Added Successfully");
        }
        return List.of("Not Added Successfully");
    }

    public List<MalzemeHareket> getAll() {
        String sql = " SELECT * FROM MALZEME_HAREKET_TBL ";
        return jdbcTemplate.query(sql, (rs, rowNumber) -> {
            MalzemeHareket mlzHrkt = new MalzemeHareket();
            mlzHrkt.setHrktId(rs.getInt("HRKT_ID"));
            mlzHrkt.setTarih(rs.getString("TARIH"));
            mlzHrkt.setMlzKodu(rs.getString("MLZ_KODU"));
            mlzHrkt.setHareketTur(rs.getString("HAREKET_TUR"));
            mlzHrkt.setMiktar(rs.getInt("MIKTAR"));
            return mlzHrkt;
        });
    }

    public List<String> update(Integer id, MalzemeHareket hrkt) {
        String sql = "UPDATE MALZEME_HAREKET_TBL SET TARIH = ?, MIKTAR = ? WHERE HRKT_ID = ? ";

        int rows = jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql);
            ps.setString(1, hrkt.getTarih());
            ps.setInt(2, hrkt.getMiktar());
            ps.setInt(3, id);
            return ps;
        });
        if (rows > 0) {
            return List.of("Updated");
        }
        return List.of("Employee Can not Updated Succesfully");
    }

    public List<String> delete(Integer id) {
        String sql = "DELETE FROM MALZEME_HAREKET_TBL WHERE HRKT_ID=?";
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

    public List<String> deleteAll(int[] id) {

        List<String> deletedMalzemeHareket = new ArrayList<>();
        for (int i : id) {
            String sql = "DELETE FROM MALZEME_HAREKET_TBL WHERE HRKT_ID=?";
            try {
                int rows = jdbcTemplate.update(connection -> {
                    PreparedStatement ps = connection.prepareStatement(sql);
                    ps.setInt(1, i);
                    return ps;
                });
                if (rows > 0) {
                    Integer num = i;

                    deletedMalzemeHareket.add(num.toString());
                } else {
                    deletedMalzemeHareket.add("0");
                }
            } catch (Exception e) {
                System.out.println(e.getMessage());
                deletedMalzemeHareket.add("0");
            }
        }
        return deletedMalzemeHareket;
    }
}

