// LoginScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LoginForm from './LoginForm';
import NavButton from './NavButton';
import { useAppContext } from './AppContext'; // Import the useAppContext hook

const LoginScreen = () => {
  const { setLoggedIn, setUser } = useAppContext(); // Use the context values

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <LoginForm />
      <Text>or</Text>
      <NavButton title='Sign up' to='Register'/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default LoginScreen;
