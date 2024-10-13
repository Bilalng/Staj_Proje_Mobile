import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Checkbox, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Malzeme {
    mlzId: number;
    mlzKodu: string;
    mlzName: string;
    oper: number;
    islemTarihi: string;
}

function Malzeme() {
    const [malzeme, setMalzeme] = useState<Malzeme[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setErrorFlag] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedMalzemeIds, setSelectedMalzemeIds] = useState<Set<number>>(new Set());
    const [newMalzeme, setNewMalzeme] = useState<Malzeme>({ mlzId: 0, mlzKodu: '', mlzName: '', oper: 0, islemTarihi: '' });
    const [updatedMalzeme, setUpdatedMalzeme] = useState<Malzeme | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const url = 'http://10.31.28.183:8080/malzeme';

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
        const fetchMalzeme = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(url);
                if (response.status === 200) {
                    const fetchedMalzeme = response.data.map((item: Malzeme) => ({
                        ...item,
                        islemTarihi: new Date(item.islemTarihi).toLocaleDateString('tr-TR'), // Tarihi formatla
                    }));
                    setMalzeme(fetchedMalzeme);
                } else {
                    throw new Error('Failed to fetch malzeme');
                }
            } catch (error) {
                setErrorFlag(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMalzeme();
    }, []);

    const handleAdd = async () => {
        try {
            setIsLoading(true);
            const formattedDate = formatDateToDDMMYYYY(newMalzeme.islemTarihi);
            console.log(formattedDate);
            const MalzemeData = {
                mlzId: newMalzeme.mlzId,
                mlzKodu: newMalzeme.mlzKodu,
                mlzName: newMalzeme.mlzName,
                oper: newMalzeme.oper,
                islemTarihi: formattedDate, 
            };
        
            const response = await axios.post(url, MalzemeData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email} ${token}`,
                },
            });
            if (response.status === 200) {
                setMalzeme([...malzeme, newMalzeme]);
                setNewMalzeme({ mlzId: 0, mlzKodu: '', mlzName: '', oper: 0, islemTarihi: '' });
                setShowAddForm(false);
            } else {
                throw new Error('Failed to add Malzeme');
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

            const idsToDelete = Array.from(selectedMalzemeIds);

            const response = await axios.post(deleteUrl, idsToDelete, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email} ${token}`,
                },
            });

            if (response.status === 200) {
                setMalzeme(malzeme.filter(mlz => !selectedMalzemeIds.has(mlz.mlzId)));
                setSelectedMalzemeIds(new Set());
            } else {
                throw new Error('Failed to delete Malzeme');
            }
        } catch (error) {
            setErrorFlag(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!updatedMalzeme) return;

        try {
            setIsLoading(true);
            const response = await axios.post(`${url}/update/${updatedMalzeme.mlzId}`, updatedMalzeme, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email} ${token}`,
                },
            });
            if (response.status === 200) {
                setMalzeme(malzeme.map(mlz =>
                    mlz.mlzId === updatedMalzeme.mlzId ? updatedMalzeme : mlz
                ));
                setSelectedMalzemeIds(new Set());
                setShowUpdateForm(false);
            } else {
                throw new Error('Failed to update malzeme');
            }
        } catch (error) {
            setErrorFlag(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (id: number) => {
        setSelectedMalzemeIds(prev => {
            const updated = new Set(prev);
            if (updated.has(id)) {
                updated.delete(id);
            } else {
                updated.add(id);
            }
            return updated;
        });
    };

    function formatDateToDDMMYYYY(dateString : string) {
        const date = new Date(dateString);
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    }
    
    const openUpdateForm = () => {
        if (selectedMalzemeIds.size !== 1) {
            Alert.alert('Güncelleme Hatası', 'Lütfen yalnızca bir malzeme seçin.');
            return;
        }
        const mlzId = Array.from(selectedMalzemeIds)[0];
        const malzemeToUpdate = malzeme.find(malzemeItem => malzemeItem.mlzId === mlzId);

        if (malzemeToUpdate) {
            setUpdatedMalzeme(malzemeToUpdate);
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
                        data={malzeme}
                        keyExtractor={(item) => item.mlzId ? item.mlzId.toString() : 'unknown'} // EmpId null veya undefined olabilir, bu yüzden bir varsayılan değer belirliyoruz
                        renderItem={({ item }) => (
                            <View style={styles.row}>
                                <Checkbox
                                    status={selectedMalzemeIds.has(item.mlzId) ? 'checked' : 'unchecked'}
                                    onPress={() => handleSelect(item.mlzId)}
                                />
                               <Text style={styles.text}>ID: {item.mlzId}</Text>
                                <Text style={styles.text}>Kod: {item.mlzKodu}</Text>
                                <Text style={styles.text}>Adi: {item.mlzName}</Text>
                                <Text style={styles.text}>Oper: {item.oper}</Text>
                                <Text style={styles.text}>Zaman: {item.islemTarihi}</Text>
                            </View>
                        )}
                        ListEmptyComponent={<Text>No employees found</Text>} // Liste boşsa gösterilecek bileşen
                    />

                    {showAddForm ? (
                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Malzeme Kodu"
                                value={newMalzeme.mlzKodu}
                                onChangeText={(text) => setNewMalzeme(prev => ({ ...prev, mlzKodu: text }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Malzeme Adi"
                                value={newMalzeme.mlzName}
                                onChangeText={(text) => setNewMalzeme(prev => ({ ...prev, mlzName: text }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Operasyon"
                                value={newMalzeme.oper.toString()}
                                keyboardType="numeric"
                                onChangeText={(text) => setNewMalzeme(prev => ({ ...prev, oper: parseInt(text) || 0 }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="İşlem Tarihi"
                                value={newMalzeme.islemTarihi}
                                onChangeText={(text) => setNewMalzeme(prev => ({ ...prev, islemTarihi: text }))}
                                keyboardType="default"
                            />
                            <Button style={styles.buttonContainer} mode="contained" onPress={handleAdd}>Ekle</Button>
                            <Button style={styles.buttonContainer} mode="contained" onPress={() => setShowAddForm(false)}><Text style={styles.textdr}>Kapat</Text></Button>
                        </View>
                    ) : (
                        <Button style={styles.buttonContainer} mode="contained" onPress={() => setShowAddForm(true)}>Malzeme Ekle</Button>
                    )}

                    {showUpdateForm && updatedMalzeme && (
                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Malzeme Kodu"
                                value={updatedMalzeme.mlzKodu}
                                onChangeText={(text) => setUpdatedMalzeme(prev => ({ ...prev!, mlzKodu: text }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Malzeme Adi"
                                value={updatedMalzeme.mlzName}
                                onChangeText={(text) => setUpdatedMalzeme(prev => ({ ...prev!, mlzName: text }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Operasyon"
                                value={updatedMalzeme.oper.toString()}
                                keyboardType="numeric"
                                onChangeText={(text) => setUpdatedMalzeme(prev => ({ ...prev!, oper: parseInt(text) || 0 }))}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="İşlem Zamani"
                                value={updatedMalzeme.islemTarihi}
                                onChangeText={(text) => setUpdatedMalzeme(prev => ({ ...prev!, islemTarihi: text }))}
                            />
                            <Button style={styles.buttonContainer} mode="contained" onPress={handleUpdate}>Güncelle</Button>
                            <Button style={styles.buttonContainer} mode="outlined" onPress={() => setShowUpdateForm(false)}>Kapat</Button>
                        </View>
                    )}

                    {selectedMalzemeIds.size > 0 && (
                        <Button style={styles.buttonContainer} mode="contained" onPress={handleDelete}>Sil</Button>
                    )}

                    {selectedMalzemeIds.size === 1 && (
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

export default Malzeme;
