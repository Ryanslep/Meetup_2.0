import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const FlexInput = ({ type, placeholder, value, onChangeText }) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={type === 'password'}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default FlexInput;
