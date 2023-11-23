import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

const SubmitButton = ({ onPress, title }) => {
  return (
    <Pressable onPress={onPress} style={styles.button}>
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 17,
    alignItems: 'center',
  },
  text: {
    color: 'white',
  },
});

export default SubmitButton;
