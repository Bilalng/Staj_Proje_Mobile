import { useState, useEffect } from 'react';
import axios from "axios";
import { View, FlatList, StyleSheet, ScrollView, Alert } from "react-native";
import { Text, Checkbox, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Verinin tipi
interface MalzemeHareket {
    hrktId: number;
    tarih: string;
    mlzKodu: string;
    hareketTur: string;
    miktar: number;
}

function MalzemeHareket() {
    const [mlzHrkt, setMalzemehrkt] = useState<MalzemeHareket[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setErrorFlag] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedMalzemeHrktIds, setSelectedMalzemeHrktIds] = useState<Set<number>>(new Set());
    const [newMalzemeHrkt, setNewMalzemeHrkt] = useState<MalzemeHareket>({ hrktId: 0, tarih: '', mlzKodu: '', hareketTur: ' ', miktar: 0 });
    const [updatedMalzemeHrkt, setUpdatedMalzemeHrkt] = useState<MalzemeHareket | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const url = 'http://10.31.28.183:8080/malzemehareket';

    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) setToken(token);
        };
        const getEmail = async () => {
            const email = await AsyncStorage.getItem('userEmail');
            if (email) setEmail(email);
        }

        getToken();
        getEmail();
    }, []);

    useEffect(() => {
        const fetchMalzemeHareket = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(url);
                if (response.status === 200) {
                    const fetchedMalzeme = response.data.map((item: MalzemeHareket) => ({
                        ...item,
                        tarih: new Date(item.tarih).toLocaleDateString('tr-TR'), // Tarihi formatla
                    }));
                    setMalzemehrkt(fetchedMalzeme);
                }
                else {
                    throw new Error('Failed to fetch malzeme');
                }
            } catch (error) {
                setErrorFlag(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMalzemeHareket();
    }, []);


    const handleAdd = async () => {
        try {
            setIsLoading(true);
            const formattedDate = formatDateToDDMMYYYY(newMalzemeHrkt.tarih);
            console.log(formattedDate);

            const MalzemeHareketData = {
                hrktId: newMalzemeHrkt.hrktId,
                tarih: formattedDate,
                mlzKodu: newMalzemeHrkt.mlzKodu,
                hareketTur: newMalzemeHrkt.hareketTur,
                miktar: newMalzemeHrkt.miktar,
            };
            const response = await axios.post(url, MalzemeHareketData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email} ${token}`,
                },
            });
            if (response.status === 200) {
                setMalzemehrkt([...mlzHrkt, newMalzemeHrkt]);
                setNewMalzemeHrkt({ hrktId: 0, tarih: '', mlzKodu: '', hareketTur: ' ', miktar: 0 });
                setShowAddForm(false);
            } else {
                throw new Error('Failed to add Malzeme Hareket');
            }
        } catch (error) {
            setErrorFlag(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            setIsLoading(true);
            const deleteUrl = `${url}/delete/all`;

            const idsToDelete = Array.from(selectedMalzemeHrktIds);

            const response = await axios.post(deleteUrl, idsToDelete, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email} ${token}`,
                },
            });

            if (response.status === 200) {
                setMalzemehrkt(mlzHrkt.filter(mlz => !selectedMalzemeHrktIds.has(mlz.hrktId)));
                setSelectedMalzemeHrktIds(new Set());
            } else {
                throw new Error('Failed to delete Malzeme Hareket');
            }
        } catch (error) {
            setErrorFlag(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!updatedMalzemeHrkt) return;

        try {
            setIsLoading(true);
            const response = await axios.post(`${url}/update/${updatedMalzemeHrkt.hrktId}`, updatedMalzemeHrkt, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email} ${token}`,
                },
            });
            if (response.status === 200) {
                setMalzemehrkt(mlzHrkt.map(mlz =>
                    mlz.hrktId === updatedMalzemeHrkt.hrktId ? updatedMalzemeHrkt : mlz
                ));
                setSelectedMalzemeHrktIds(new Set());
                setShowUpdateForm(false);
            } else {
                throw new Error('Failed to update malzeme Hareket');
            }
        } catch (error) {
            setErrorFlag(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (id: number) => {
        setSelectedMalzemeHrktIds(prev => {
            const updated = new Set(prev);
            if (updated.has(id)) {
                updated.delete(id);
            } else {
                updated.add(id);
            }
            return updated;
        });
    };
    function formatDateToDDMMYYYY(dateString: string) {
        const date = new Date(dateString);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }

    const openUpdateForm = () => {
        if (selectedMalzemeHrktIds.size !== 1) {
            Alert.alert('Güncelleme Hatası', 'Lütfen yalnızca bir malzeme seçin.');
            return;
        }
        const hrktId = Array.from(selectedMalzemeHrktIds)[0];
        const malzemeToUpdate = mlzHrkt.find(malzemeItem => malzemeItem.hrktId === hrktId);

        if (malzemeToUpdate) {
            setUpdatedMalzemeHrkt(malzemeToUpdate);
            setShowUpdateForm(true);
        }
    };


    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : hasError ? (
                <Text>Veri getirme hatası</Text>
            ) : (
                <>
                    <FlatList
                        data={mlzHrkt}
                        keyExtractor={(item) => item.hrktId ? item.hrktId.toString() : 'unknown'} // EmpId null veya undefined olabilir, bu yüzden bir varsayılan değer belirliyoruz
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                <Checkbox
                                    status={selectedMalzemeHrktIds.has(item.hrktId) ? 'checked' : 'unchecked'}
                                    onPress={() => handleSelect(item.hrktId)}
                                />
                                <Text style={styles.text}>ID: {item.hrktId}</Text>
                                <Text style={styles.text}>TARİH: {item.tarih}</Text>
                                <Text style={styles.text}>MLZ KOD: {item.mlzKodu}</Text>
                                <Text style={styles.text}>Hareket Tur: {item.hareketTur}</Text>
                                <Text style={styles.text}>MIKTAR: {item.miktar}</Text>

                            </View>
                        )}
                        ListEmptyComponent={<Text>No employees found</Text>} // Liste boşsa gösterilecek bileşen
                    />


                    {showAddForm ? (
                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Tarih"
                                value={newMalzemeHrkt.tarih}
                                onChangeText={(text) => setNewMalzemeHrkt(prev => ({ ...prev, tarih: text }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Malzeme Kodu"
                                value={newMalzemeHrkt.mlzKodu}
                                onChangeText={(text) => setNewMalzemeHrkt(prev => ({ ...prev, mlzKodu: text }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Hareket Tur"
                                value={newMalzemeHrkt.hareketTur}
                                onChangeText={(text) => setNewMalzemeHrkt(prev => ({ ...prev, hareketTur: text }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Miktar"
                                keyboardType="numeric"
                                value={newMalzemeHrkt.miktar.toString()}
                                onChangeText={(text) => setNewMalzemeHrkt(prev => ({ ...prev, miktar: parseFloat(text) }))}
                            />
                            <Button style={styles.buttonContainer} mode="contained" onPress={handleAdd}>Ekle</Button>
                            <Button style={styles.buttonContainer} mode="contained" onPress={() => setShowAddForm(false)}><Text style={styles.textdr}>Kapat</Text></Button>
                        </View>
                    ) : (
                        <Button style={styles.buttonContainer} mode="contained" onPress={() => setShowAddForm(true)}>Malzeme Ekle</Button>
                    )}

                    {showUpdateForm && updatedMalzemeHrkt && (
                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Tarih"
                                value={updatedMalzemeHrkt.tarih}
                                onChangeText={(text) => setUpdatedMalzemeHrkt(prev => ({ ...prev!, islemTarihi: text }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Malzeme Kodu"
                                value={updatedMalzemeHrkt.mlzKodu}
                                onChangeText={(text) => setUpdatedMalzemeHrkt(prev => ({ ...prev!, mlzName: text }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Hareket Turu"
                                value={updatedMalzemeHrkt.hareketTur}
                                onChangeText={(text) => setUpdatedMalzemeHrkt(prev => ({ ...prev!, mlzName: text }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Miktar"
                                keyboardType="numeric"
                                value={updatedMalzemeHrkt.miktar.toString()}
                                onChangeText={(text) => setUpdatedMalzemeHrkt(prev => ({ ...prev!, miktar: parseInt(text) || 0 }))}
                            />
                            <Button style={styles.buttonContainer} mode="contained" onPress={handleUpdate}>Güncelle</Button>
                            <Button style={styles.buttonContainer} mode="outlined" onPress={() => setShowUpdateForm(false)}>Kapat</Button>
                        </View>
                    )}


                    {selectedMalzemeHrktIds.size > 0 && (
                        <Button style={styles.buttonContainer} mode="contained" onPress={handleDelete}>Sil</Button>
                    )}

                    {selectedMalzemeHrktIds.size === 1 && (
                        <Button style={styles.buttonContainer} mode="contained" onPress={openUpdateForm}>Güncelle</Button>
                    )}
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    scrollContainer: {
        flex: 1,
    },
    container: {
        padding: 20,
        flex: 1,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    text: {
        marginLeft: 10,
        flex: 1,
    },
    form: {
        marginVertical: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 10,
        marginBottom: 10,
        backgroundColor: "black",
    },
    textdr: {
        color: "#ccc",
    },
});

export default MalzemeHareket;
