package com.spring.SpringbootProject.Table;

public class MalzemeHareket {
    private int hrktId;
    private String tarih;
    private String mlzKodu;
    private String hareketTur;
    private int miktar;


    public int getHrktId() {
        return hrktId;
    }

    public void setHrktId(int hrktId) {
        this.hrktId = hrktId;
    }

    public String getTarih() {
        return tarih;
    }

    public void setTarih(String tarih) {
        this.tarih = tarih;
    }

    public String getMlzKodu() {
        return mlzKodu;
    }

    public void setMlzKodu(String mlzKodu) {
        this.mlzKodu = mlzKodu;
    }

    public String getHareketTur() {
        return hareketTur;
    }

    public void setHareketTur(String hareketTur) {
        this.hareketTur = hareketTur;
    }

    public int getMiktar() {
        return miktar;
    }

    public void setMiktar(int miktar) {
        this.miktar = miktar;
    }
}
