// UserWithOptions.js
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './AppContext';
const UserWithOptions = ({ randomUser, receiverId, onPressBlock, onPressAddFriend }) => {
  const { user } = useAppContext();
  const navigation = useNavigation();
  const handlePressMessage = () => {
    console.log('Message Press User: ', user._id)
    navigation.navigate('Send Message', {
      senderId: user._id,
      receiverId,
    });
  };

  return (
    <View style={styles.userContainer}>
      <Text style={styles.username}>{randomUser.username}</Text>
      <View style={styles.iconContainer}>
        <Pressable onPress={handlePressMessage}>
          <Image source={require('../assets/message.png')} style={styles.icon} />
        </Pressable>
        <Pressable onPress={onPressBlock}>
          <Image source={require('../assets/blockUser.png')} style={styles.icon} />
        </Pressable>
        <Pressable onPress={onPressAddFriend}>
          <Image source={require('../assets/addFriend.png')} style={styles.icon} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    flex: 1,
    marginBottom: 7,
  },
  username: {
    marginRight: 10,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
});

export default UserWithOptions;
