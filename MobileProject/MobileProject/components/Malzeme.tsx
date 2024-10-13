import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from "react-native";
import { Text, ActivityIndicator, Button } from 'react-native-paper'
import axios from "axios";

// Verinin tipi
interface Malzeme {
    mlzId: number;
    mlzKodu : string;
    mlzAdi : string;
    oper: number;
    islemZamani: string;
}

function Malzeme() {
    let [visibleTable, setTable] = useState();
    const [Malzeme, setMalzeme] = useState<Malzeme[]>([]);  // Emp dizisinin tipini tanımladık
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setErrorFlag] = useState(false);

    useEffect(() => {
        const url = "http://10.31.28.183:8080/malzeme";
        const abortController = new AbortController();
        
        const fetchUsers = async () => {
            try {
                setIsLoading(true);

                const response = await axios.get(url, {
                    signal: abortController.signal,
                });

                if (response.status === 200) {
                    setMalzeme(response.data as Malzeme[]);
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
                    data={Malzeme}
                    keyExtractor={(item) => item.mlzId.toString()}  // Tip tanımlı olduğu için 'id' hata vermeyecek
                    renderItem={({ item }) => (
                        <View style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
                            <Text style={{marginBottom: 10}}>ID: {item.mlzId}</Text>
                            <Text style={{marginBottom: 10}}>Malzeme Kodu: {item.mlzKodu}</Text>
                            <Text style={{marginBottom: 10}}>Malzeme Adı: {item.mlzAdi}</Text>
                            <Text style={{marginBottom: 10}}>Oper: {item.oper}</Text>
                            <Text style={{marginBottom: 10}}>İşlem Zamanı: {item.islemZamani}</Text>
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
export default Malzeme;
