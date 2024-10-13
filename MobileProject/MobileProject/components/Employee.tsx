import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Checkbox, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import axios from 'axios';

interface Employee {
    empId: number;
    empName: string;
    salary: string;
}

function Employee() {
    const [emp, setEmp] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setErrorFlag] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [selectedEmpIds, setSelectedEmpIds] = useState<Set<number>>(new Set());
    const [newEmployee, setNewEmployee] = useState<Employee>({ empId: 0, empName: '', salary: '' });

    const url = 'http://10.31.28.183:8080/emplooye';

    useEffect(() => {
        const fetchEmployees = async () => {
            setIsLoading(true);
            try {
                const response = await axios.get(url);
                if (response.status === 200) {
                    setEmp(response.data as Employee[]);
                } else {
                    throw new Error('Failed to fetch employees');
                }
            } catch (error) {
                setErrorFlag(true);
            } finally {
                setIsLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleAdd = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(url, newEmployee, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setEmp([...emp, newEmployee]);
                setNewEmployee({ empId: 0, empName: '', salary: '' });
                setShowAddForm(false);
            } else {
                throw new Error('Failed to add employee');
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
            for (const empId of selectedEmpIds) {
                const deleteUrl = `${url}/delete/${empId}`;
                const response = await axios.post(deleteUrl);
                if (response.status === 200) {
                    setEmp(emp.filter(employee => !selectedEmpIds.has(employee.empId)));
                } else {
                    throw new Error('Failed to delete employee');
                }
            }
            setSelectedEmpIds(new Set());
        } catch (error) {
            setErrorFlag(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (selectedEmpIds.size !== 1) {
            Alert.alert('Güncelleme Hatası', 'Lütfen yalnızca bir çalışan seçin.');
            return;
        }
        const empId = Array.from(selectedEmpIds)[0];
        const employeeToUpdate = emp.find(employee => employee.empId === empId);
        if (!employeeToUpdate) return;

        try {
            setIsLoading(true);
            const response = await axios.put(`${url}/update/${empId}`, employeeToUpdate, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.status === 200) {
                setEmp(emp.map(employee =>
                    employee.empId === empId ? employeeToUpdate : employee
                ));
                setSelectedEmpIds(new Set());
            } else {
                throw new Error('Failed to update employee');
            }
        } catch (error) {
            setErrorFlag(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelect = (id: number) => {
        setSelectedEmpIds(prev => {
            const updated = new Set(prev);
            if (updated.has(id)) {
                updated.delete(id);
            } else {
                updated.add(id);
            }
            return updated;
        });
    };

    return (
        <ScrollView style={styles.scrollContainer}>
            <View style={styles.container}>
                {isLoading ? (
                    <ActivityIndicator size="large" color="#0000ff" />
                ) : hasError ? (
                    <Text>Veri getirme hatası</Text>
                ) : (
                    <>
                        <FlatList
                            data={emp}
                            keyExtractor={(item) => item.empId.toString()}
                            renderItem={({ item }) => (
                                <View style={styles.row}>
                                    <Checkbox
                                        status={selectedEmpIds.has(item.empId) ? 'checked' : 'unchecked'}
                                        onPress={() => handleSelect(item.empId)}
                                    />
                                    <Text style={styles.text}>ID: {item.empId}</Text>
                                    <Text style={styles.text}>Name: {item.empName}</Text>
                                    <Text style={styles.text}>Salary: {item.salary}</Text>
                                </View>
                            )}
                        />

                        {showAddForm ? (
                            <View style={styles.form}>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Employee Name"
                                    value={newEmployee.empName}
                                    onChangeText={(text) => setNewEmployee(prev => ({ ...prev, empName: text }))}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Salary"
                                    value={newEmployee.salary}
                                    onChangeText={(text) => setNewEmployee(prev => ({ ...prev, salary: text }))}
                                />
                                <Button mode="contained" onPress={handleAdd}>Ekle</Button>
                            </View>
                        ) : (
                            <Button mode="contained" onPress={() => setShowAddForm(true)} buttonColor='#539d28'>Ekle</Button>
                        )}

                        <View style={styles.buttonContainer}>
                            <Button mode="contained" onPress={handleDelete} buttonColor="#9b0303">Toplu Sil</Button>
                            <Button mode="contained" onPress={handleUpdate} buttonColor="#ee5230">Güncelle</Button>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
    },
});

export default Employee;
