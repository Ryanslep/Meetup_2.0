// RegisterScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RegisterForm from './RegisterForm';
import NavButton from './NavButton';
import { useAppContext } from './AppContext'; // Import the useAppContext hook

const RegisterScreen = () => {
  const { setLoggedIn, setUser } = useAppContext(); // Use the context values

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <RegisterForm />
      <Text>or</Text>
      <NavButton title='Log in' to='Login'/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default RegisterScreen;
