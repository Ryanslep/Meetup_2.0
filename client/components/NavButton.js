import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavButton = ({ to, title }) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate(`${to}`);
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
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

export default NavButton;
