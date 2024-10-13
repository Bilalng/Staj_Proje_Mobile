import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';

interface SplashScreenProps {
    onFinishLoading?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinishLoading }) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
            if (onFinishLoading) {
                onFinishLoading();
            }
        }, 3000); // 3 saniye yükleme animasyonu gösterilecek

        return () => clearTimeout(timer);
    }, [onFinishLoading]);

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#000000" />
            <Text style={styles.text}>Yükleniyor...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ffffff',
    },
    text: {
        marginTop: 20,
        fontSize: 18,
        color: '#333333',
    },
});

export default SplashScreen;
