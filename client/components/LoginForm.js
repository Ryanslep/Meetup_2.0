import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import FlexInput from './FlexInput';
import SubmitButton from './SubmitButton';

import userApi from '../api/userApi';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    console.log('Username:', username);
    console.log('Password:', password);

    const sendLogin = await userApi.login(username, password);
    const response = await sendLogin;
    console.log(response);

    // You can add logic to show a toast message here based on the response
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
      <SubmitButton
        onPress={handleLogin}
        title="Login"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
});

export default LoginForm;
