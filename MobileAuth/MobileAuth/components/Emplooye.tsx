import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Alert } from 'react-native';
import { Text, Checkbox, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface Employee {
    empId: number;
    empName: string;
    salary: number;
}

function Employee() {
    const [emp, setEmp] = useState<Employee[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setErrorFlag] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedEmpIds, setSelectedEmpIds] = useState<Set<number>>(new Set());
    const [newEmployee, setNewEmployee] = useState<Employee>({ empId: 0, empName: '', salary: 0 });
    const [updatedEmployee, setUpdatedEmployee] = useState<Employee | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);

    const url = 'http://10.31.28.183:8080/emplooye';

    useEffect(() => {
        const getToken = async () => {
            const token = await AsyncStorage.getItem('userToken');
            if (token) setToken(token);
        };
        const getEmail = async () => {
            const email = await AsyncStorage.getItem('userEmail');
            if (email) setEmail(email);
        };

        getToken();
        getEmail();
    }, []);

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
            const employeeData = {
                empName: newEmployee.empName,
                salary: newEmployee.salary,
            };

            const response = await axios.post(url, employeeData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email} ${token}`,
                },
            });

            if (response.status === 200) {
                setEmp([...emp, { ...newEmployee, empId: response.data.empId }]);
                setNewEmployee({ empId: 0, empName: '', salary: 0 });
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
            const deleteUrl = `${url}/delete/all`;

            const idsToDelete = Array.from(selectedEmpIds);

            const response = await axios.post(deleteUrl, idsToDelete, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email} ${token}`,
                },
            });

            if (response.status === 200) {
                setEmp(emp.filter(employee => !selectedEmpIds.has(employee.empId)));
                setSelectedEmpIds(new Set());
            } else {
                throw new Error('Failed to delete employees');
            }
        } catch (error) {
            setErrorFlag(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdate = async () => {
        if (!updatedEmployee) return;

        try {
            setIsLoading(true);
            const response = await axios.post(`${url}/update/${updatedEmployee.empId}`, updatedEmployee, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${email} ${token}`,
                },
            });

            if (response.status === 200) {
                setEmp(emp.map(employee =>
                    employee.empId === updatedEmployee.empId ? updatedEmployee : employee
                ));
                setSelectedEmpIds(new Set());
                setShowUpdateForm(false);
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

    const openUpdateForm = () => {
        if (selectedEmpIds.size !== 1) {
            Alert.alert('Update Error', 'Please select only one employee.');
            return;
        }
        const empId = Array.from(selectedEmpIds)[0];
        const employeeToUpdate = emp.find(employee => employee.empId === empId);

        if (employeeToUpdate) {
            setUpdatedEmployee(employeeToUpdate);
            setShowUpdateForm(true);
        }
    };

    return (
        <View style={styles.container}>
            {isLoading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : hasError ? (
                <Text>Failed to load data</Text>
            ) : (
                <>
                    <FlatList
                        data={emp}
                        keyExtractor={(item) => item.empId ? item.empId.toString() : 'unknown'}
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
                        ListEmptyComponent={<Text>No employees found</Text>} // Liste boşsa gösterilecek bileşen
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
                                value={newEmployee.salary.toString()}
                                keyboardType="numeric"
                                onChangeText={(text) => setNewEmployee(prev => ({ ...prev, salary: parseInt(text) || 0 }))}
                            />
                            <Button style={styles.buttonContainer} mode="contained" onPress={handleAdd}>Ekle</Button>
                            <Button style={styles.buttonContainer} mode="contained" onPress={() => setShowAddForm(false)}><Text style={styles.textdr}>Kapat</Text></Button>
                        </View>
                    ) : (
                        <Button style={styles.buttonContainer} mode="contained" onPress={() => setShowAddForm(true)}>Add</Button>
                    )}

                    {showUpdateForm && updatedEmployee && (
                        <View style={styles.form}>
                            <TextInput
                                style={styles.input}
                                placeholder="Employee Name"
                                value={updatedEmployee.empName}
                                onChangeText={(text) => setUpdatedEmployee(prev => prev ? { ...prev, empName: text } : null)}
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Salary"
                                value={updatedEmployee.salary.toString()}
                                keyboardType="numeric"
                                onChangeText={(text) => setUpdatedEmployee(prev => prev ? { ...prev, salary: parseInt(text) || 0 } : null)}
                            />
                            <Button style={styles.buttonContainer} mode="contained" onPress={handleUpdate}>Güncelle</Button>
                            <Button style={styles.buttonContainer} mode="outlined" onPress={() => setShowUpdateForm(false)}>Kapat</Button>
                        </View>
                    )}

                    {selectedEmpIds.size > 0 && (
                        <Button style={styles.buttonContainer} mode="contained" onPress={handleDelete}>Sil</Button>
                    )}

                    {selectedEmpIds.size === 1 && (
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

export default Employee;
