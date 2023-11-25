// UserWithOptions.js
import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './AppContext';
import userApi from '../api/userApi';
import Toast from 'react-native-root-toast';

const UserWithOptions = ({ randomUser, receiverId }) => {
  const { user } = useAppContext();
  const navigation = useNavigation();

  const showToast = (message, backgroundColor) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: -80,
      shadow: true,
      backgroundColor,
      animation: true,
    });
  };

  const handlePressMessage = () => {
    navigation.navigate('Send Message', {
      senderId: user._id,
      receiverId,
    });
  };

  const handleBlock = async () => {
    try {
      const blockAttempt = await userApi.blockUser(user._id, receiverId);
      if (blockAttempt === 'blocked') {
        showToast(`You have blocked ${randomUser.username}!`, 'orangered');
      } else {
        showToast(`No longer blocking ${randomUser.username}`, 'green');
      }
      return blockAttempt;
    } catch (err) {
      showToast(`Error blocking ${receiverId}`);
    }
  };

  return (
    <View style={styles.userContainer}>
      {randomUser.profilePic && (
        <Image source={{ uri: randomUser.profilePic }} style={styles.profilePic} />
      )}
      <Text style={styles.username}>{randomUser.username}</Text>
      <View style={styles.buttonsContainer}>
        <Pressable onPress={handlePressMessage}>
          <Image source={require('../assets/message.png')} style={styles.icon} />
        </Pressable>
        <Pressable onPress={handleBlock}>
          <Image source={require('../assets/blockUser.png')} style={styles.icon} />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Align items to the start and buttons to the end
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    flex: 1,
    marginBottom: 7,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    marginRight: 10,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end', // Align buttons to the end of the row
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
});

export default UserWithOptions;
