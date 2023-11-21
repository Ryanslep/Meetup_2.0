// UserWithOptions.js
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UserWithOptions = ({ user, sender, receiver, onPressMessage, onPressBlock, onPressAddFriend }) => {
  const navigation = useNavigation();

  const handlePressMessage = () => {
    // Navigate to SendMessageScreen, passing necessary props
    
    console.log('Sender: ', sender)
    console.log('Receiver: ', receiver)
    navigation.navigate('Send Message', {
      sender,
      receiver,
    });
  };

  return (
    <View style={styles.userContainer}>
      <Text style={styles.username}>{user.username}</Text>
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
