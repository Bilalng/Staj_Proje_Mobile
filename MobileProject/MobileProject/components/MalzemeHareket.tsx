import { useState, useEffect } from 'react';
import axios from "axios";
import { View, FlatList, StyleSheet } from "react-native";
import { Text, ActivityIndicator, Button } from 'react-native-paper'

// Verinin tipi
interface MalzemeHareket {
    hrktId: number;
    tarih : string;
    mlzKodu : string;
    hareketTur: string;
    miktar: number;
}

function MalzemeHareket() {
    let [visibleTable, setTable] = useState();
    const [MalzemeHareket, setMalzemeHareket] = useState<MalzemeHareket[]>([]);  // Emp dizisinin tipini tanımladık
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setErrorFlag] = useState(false);

    useEffect(() => {
        const url = "http://10.31.28.183:8080/malzemehareket";
        const abortController = new AbortController();
        
        const fetchUsers = async () => {
            try {
                setIsLoading(true);

                const response = await axios.get(url, {
                    signal: abortController.signal,
                });

                if (response.status === 200) {
                    setMalzemeHareket(response.data as MalzemeHareket[]);
                    setIsLoading(false);
                } else {
                    throw new Error("İşlem Gerçekleşemedi.");
                }
            } catch (error) {
                if (abortController.signal.aborted) {
                    console.log("Get isteği iptal edildi.");
                } else {
                    setErrorFlag(true);
                    setIsLoading(false);
                }
            }
        };

        fetchUsers();

    
    }, []);

    return (
        <View style={{ padding: 20 }}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : hasError ? (
                <Text>Veri getirme hatası</Text>
            ) : (
                <FlatList
                    data={MalzemeHareket}
                    keyExtractor={(item) => item.hrktId.toString()}  // Tip tanımlı olduğu için 'id' hata vermeyecek
                    renderItem={({ item }) => (
                        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text style={{marginBottom: 10}}>ID: {item.hrktId}</Text>
                            <Text style={{marginBottom: 10}}>Name: {item.tarih}</Text>
                            <Text style={{marginBottom: 10}}>Salary: {item.mlzKodu}</Text>
                            <Text style={{marginBottom: 10}}>Salary: {item.hareketTur}</Text>
                            <Text style={{marginBottom: 10}}>Salary: {item.miktar}</Text>
                            <Button style={styles.button} mode="contained" buttonColor="#9b0303">Sil</Button>

                        </View>
                    )}
                />
            )}

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
             <Button  mode="contained" buttonColor="#ee5230">Güncelle</Button>
             <Button  mode="contained" buttonColor='#539d28'>Ekle</Button>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        width: '20%'
    }
  });

export default MalzemeHareket;
