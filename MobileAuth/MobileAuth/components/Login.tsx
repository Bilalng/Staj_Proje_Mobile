import React, { useState } from 'react';
import { View, StyleSheet, Alert, TouchableWithoutFeedback, Keyboard, Text, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { TextInput as PaperTextInput } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from 'expo-router';


export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [usermail, setEmail] = useState('');
    const [userpassword, setPassword] = useState('');
    const [username, setFirstName] = useState('');
    const [surname, setLastName] = useState('');
    const [userphone, setPhoneNumber] = useState('');
    const navigation = useNavigation();

    const handleAuth = async () => {
        try {
            const url = isLogin
                ? 'http://10.31.28.183:8085/auth/login'
                : 'http://10.31.28.183:8085/auth/register';
            const data = isLogin
                ? { usermail, userpassword }
                : { username, surname, userphone, usermail, userpassword };
    
            const response = await axios.post(url, data);
    
            if (isLogin && response.data[1] != null) {
                await AsyncStorage.setItem('userToken', response.data[1]);
                await AsyncStorage.setItem('userEmail', data.usermail);
    
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Home' }],
                });
    
                Alert.alert('Başarılı', 'Giriş yapıldı!', [{ text: 'OK' }]);
            } else if (!isLogin && response.status === 200) {
                Alert.alert('Başarılı', 'Kayıt tamamlandı!', [{ text: 'OK' }]);
                setIsLogin(true);
            } else {
                Alert.alert('Hata', 'İşlem başarısız', [{ text: 'OK' }]);
            }
        } catch (error) {
            Alert.alert('Hata', isLogin ? 'Giriş yapılamadı' : 'Kayıt yapılamadı', [{ text: 'OK' }]);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <View style={styles.container}>
                <Image source={require('@/assets/images/fox.png')} style={styles.image} />
                {!isLogin && (
                    <>
                        <PaperTextInput
                            label="İsim"
                            outlineColor='black'
                            activeOutlineColor='black'
                            mode='outlined'
                            value={username}
                            onChangeText={setFirstName}
                            style={styles.input}
                        />
                        <PaperTextInput
                            label="Soyisim"
                            outlineColor='black'
                            activeOutlineColor='black'
                            mode='outlined'
                            value={surname}
                            onChangeText={setLastName}
                            style={styles.input}
                        />
                        <PaperTextInput
                            label="Telefon Numarası"
                            outlineColor='black'
                            activeOutlineColor='black'
                            mode='outlined'
                            value={userphone}
                            onChangeText={setPhoneNumber}
                            style={styles.input}
                            keyboardType="phone-pad"
                        />
                    </>
                )}
                
                <PaperTextInput
                    label="E-mail"
                    value={usermail}
                    outlineColor='black'
                    activeOutlineColor='black'
                    mode='outlined'
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <PaperTextInput
                    label="Şifre"
                    outlineColor='black'
                    activeOutlineColor='black'
                    mode='outlined'
                    value={userpassword}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                />
                <Button
                    mode="contained"
                    onPress={handleAuth}
                    style={styles.button}
                >
                    {isLogin ? 'Giriş Yap' : 'Kayıt Ol'}
                </Button>
                <Button
                    mode="text"
                    onPress={() => setIsLogin((prev) => !prev)}
                    style={styles.switchButton}
                >
                    <Text style={styles.linkText}>
                        {isLogin ? 'Hesabın yok mu? Kayıt ol' : 'Giriş yapmak için buraya tıkla'}
                    </Text>
                </Button>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 200, // Resmin genişliğini ayarlayın
        height: 200, // Resmin yüksekliğini ayarlayın
        alignSelf: 'center', // Resmin ekranın ortasında olmasını sağlar
        marginBottom: 20,
    },
    input: {
        marginBottom: 10,
    },
    button: {
        marginTop: 10,
        backgroundColor: '#000000',
    },
    switchButton: {
        marginTop: 10,
    },
    linkText: {
        color: '#000000',
    },
});
