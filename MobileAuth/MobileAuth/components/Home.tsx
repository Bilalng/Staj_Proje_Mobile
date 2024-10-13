import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';


export default function Home() {
    const navigation = useNavigation();



    const handleLogout = async () => {
        await AsyncStorage.removeItem('userToken');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <View style={styles.container}>
            <Button style={styles.button} mode="contained" buttonColor='black' onPress={() => {
                navigation.navigate('Emplooye')
            }}>
                <Text style={styles.text}>Employee</Text>
            </Button>
            <Button style={styles.button} mode="contained" buttonColor='black' onPress={() => {
                navigation.navigate('Malzeme')
            }}>
                <Text style={styles.text}>Malzeme</Text>
            </Button>
            <Button style={styles.button} mode="contained" buttonColor='black' onPress={() => {
                navigation.navigate('MalzemeHareket')
            }}>
                <Text style={styles.text}>Malzeme Hareket</Text>
            </Button>

            <Button style={styles.button} mode="contained" buttonColor='black' onPress={() => handleLogout()}>
                <Text style={styles.text}>Çıkış Yap</Text>
            </Button>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },

    button: {
        marginBottom: 20,
    },
    text: {
        color: "white"
    }
});
