// LoginForm.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'

import FlexInput from './FlexInput';
import SubmitButton from './SubmitButton';

import userApi from '../api/userApi';
import { useAppContext } from './AppContext'; // Import the useAppContext hook

const LoginForm = () => {
    const navigation = useNavigation(); // Hook for navigation
    const { setLoggedIn, setUser } = useAppContext(); // Use the context values

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [response, setResponse] = useState(null);

    useEffect(() => {
        const checkSession = async () => {
            // Check for previous session
            const previousSession = await AsyncStorage.getItem('@userId');
            if(previousSession) {
                const user = await userApi.getUserInfo(previousSession);
                setLoggedIn(true)
                setUser(user)
                navigation.navigate('Dashboard');
            }
        }
        checkSession()
    }, [])

    const handleLogin = async () => {

        const sendLogin = await userApi.login(username, password);
        const data = await sendLogin;

        // Always set the response to trigger CustomAlert
        setResponse(data);

        if (data && data.success) {
            // Navigate to the next screen (replace 'Home' with your screen name)
            setLoggedIn(true)
            setUser(data.user)
            await AsyncStorage.setItem('@userId', data.user._id);
            navigation.navigate('Dashboard');
        }
    };

    return (
        <View style={styles.container}>
            <FlexInput
                type="text"
                placeholder="Username or Email"
                value={username}
                onChangeText={(text) => setUsername(text)}
            />
            <FlexInput
                type="password"
                placeholder="Password"
                value={password}
                onChangeText={(text) => setPassword(text)}
            />
            <SubmitButton title="Login" onPress={handleLogin} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        minWidth: '100%'
    },
});

export default LoginForm;
