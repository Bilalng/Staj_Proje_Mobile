package com.spring.SpringbootProject.Table;

public class Malzeme {
    private int mlzId;
    private String mlzName;
    private String mlzKodu;
    private int oper;
    private String islemTarihi;

    public int getMlzId() {
        return mlzId;
    }

    public void setMlzId(int mlzId) {
        this.mlzId = mlzId;
    }

    public String getMlzName() {
        return mlzName;
    }

    public void setMlzName(String mlzName) {
        this.mlzName = mlzName;
    }

    public String getMlzKodu() {
        return mlzKodu;
    }

    public void setMlzKodu(String mlzKodu) {
        this.mlzKodu = mlzKodu;
    }

    public int getOper() {
        return oper;
    }

    public void setOper(int oper) {
        this.oper = oper;
    }

    public String getIslemTarihi() {
        return islemTarihi;
    }

    public void setIslemTarihi(String islemTarihi) {
        this.islemTarihi = islemTarihi;
    }
}
