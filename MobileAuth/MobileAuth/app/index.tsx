import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createStackNavigator } from '@react-navigation/stack';
import EmplooyeScreen from '@/components/Emplooye';
import MalzemeScreen from '@/components/Malzeme';
import MalzemeHareketScreen from '@/components/MalzemeHareket';
import LoginScreen from '@/components/Login';
import HomeScreen from '@/components/Home';
import SplashScreen from '@/components/SplashScreen';

const AuthStack = createStackNavigator();
const AppStack = createStackNavigator();

const index = () => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const initializeApp = async () => {
            await new Promise(resolve => setTimeout(resolve, 3000));
            const userToken = await AsyncStorage.getItem('userToken');
            setIsLoggedIn(!!userToken);
            setIsLoading(false);
        };
        initializeApp();
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <>
            {isLoggedIn ? (
                <AppStack.Navigator screenOptions={{ headerShown: false }}>
                    <AuthStack.Screen name='Login' component={LoginScreen} />
                    <AppStack.Screen name='Home' component={HomeScreen} />
                    <AppStack.Screen name='Emplooye' component={EmplooyeScreen} />
                    <AppStack.Screen name='Malzeme' component={MalzemeScreen} />
                    <AppStack.Screen name='MalzemeHareket' component={MalzemeHareketScreen} />
                </AppStack.Navigator>
            ) : (
                <AuthStack.Navigator screenOptions={{ headerShown: false }}>
                    <AuthStack.Screen name='Login' component={LoginScreen} />
                </AuthStack.Navigator>
            )}
        </>
    );
};

export default index;
