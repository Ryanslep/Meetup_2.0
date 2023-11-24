import React from 'react';
import { Pressable, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const NavButton = ({ to, title, icon }) => {
  const navigation = useNavigation();
  const handlePress = () => {
    navigation.navigate(`${to}`);
  };

  return (
    <Pressable style={styles.button} onPress={handlePress}>
      <Image style={styles.icon} source={icon}></Image>
      <Text>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
    button: {
      // backgroundColor: 'blue',
      padding: 0,
      borderRadius: 17,
      alignItems: 'center',
    },
    text: {
      color: 'white',
    },
    icon: {
      height: hp('7%'),
      width: wp('15%')
    }
  });

export default NavButton;
