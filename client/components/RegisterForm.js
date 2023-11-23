// RegisterForm.js
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import FlexInput from './FlexInput';
import SubmitButton from './SubmitButton';
import CustomAlert from './CustomAlert';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './AppContext'; // Import useAppContext hook

import userApi from '../api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterForm = () => {
  const navigation = useNavigation();
  const { setLoggedIn, setUser } = useAppContext(); // Use the setLoggedIn function from the context

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [response, setResponse] = useState(null);

  const handleRegister = async () => {
    const errors = validateForm(username, email, password, confirmPassword, fullName);
    setValidationErrors(errors);

    // If there are validation errors, stop the registration process
    if (Object.keys(errors).length > 0) {
      return;
    }

    const registerData = await userApi.register(username, email, password, fullName);
    if (registerData.message) {
      setResponse(registerData.message);
    } else {
      await AsyncStorage.setItem('@userId', registerData.user._id)
      setLoggedIn(true);
      setUser(registerData.user);
      setResponse('Account Registered');
      navigation.navigate('Profile');
    }
  };

  const validateForm = (username, email, password, confirmPassword, fullName) => ({
    ...(email && !/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email) && { email: 'Invalid email format' }),
    ...(email && !/(uncc\.edu|charlotte\.edu)$/.test(email.split('@')[1]) && { email: 'Must be @uncc.edu or @charlotte.edu' }),
    ...(username && username.length < 4 && { username: 'Username must be at least 4 characters' }),
    ...(password && password.length < 4 && { password: 'Password must be at least 4 characters' }),
    ...(confirmPassword && password !== confirmPassword && { confirmPassword: 'Passwords do not match' }),
    ...(fullName && fullName.length < 1 && { fullName: 'Full Name cannot be empty' }),
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Full Name</Text>
      {validationErrors.fullName && <Text style={styles.error}>{validationErrors.fullName}</Text>}
      <FlexInput
        type="text"
        value={fullName}
        onChangeText={(text) => setFullName(text)}
      />
      <Text style={styles.text}>Username</Text>
      {validationErrors.username && <Text style={styles.error}>{validationErrors.username}</Text>}
      <FlexInput
        type="text"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      {validationErrors.email && <Text style={styles.error}>{validationErrors.email}</Text>}
      <Text style={styles.text}>Email</Text>
      <FlexInput
        type="text"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />
      {validationErrors.password && <Text style={styles.error}>{validationErrors.password}</Text>}
      <Text style={styles.text}>Password</Text>
      <FlexInput
        type="password"
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      {validationErrors.confirmPassword && <Text style={styles.error}>{validationErrors.confirmPassword}</Text>}
      <Text style={styles.text}>Confirm Password</Text>
      <FlexInput
        type="password"
        value={confirmPassword}
        onChangeText={(text) => setConfirmPassword(text)}
      />
      {response && <CustomAlert message={response.message} success={response.success} />}
      <SubmitButton onPress={handleRegister} title="Sign Up" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333', // You can change the color to your preference
  },
});

export default RegisterForm;
