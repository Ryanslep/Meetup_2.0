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
        // setMyRsvps([...myRsvps, event]);
      } else {
        showToast(`No longer blocking ${randomUser.username}`, 'green');
        // setMyRsvps(myRsvps.filter((rsvp) => rsvp._id !== event._id));
      }
      return blockAttempt;
    } catch (err) {
      showToast(`Error blocking ${receiverId}`);
    }
  };


  return (
    <View style={styles.userContainer}>
      <Text style={styles.username}>{randomUser.username}</Text>
      <View style={styles.iconContainer}>
        <Pressable onPress={handlePressMessage}>
          <Image source={require('../assets/message.png')} style={styles.icon} />
        </Pressable>
        <Pressable onPress={handleBlock}>
          <Image source={require('../assets/blockUser.png')} style={styles.icon} />
        </Pressable>
        {/* <Pressable onPress={onPressAddFriend}>
          <Image source={require('../assets/addFriend.png')} style={styles.icon} />
        </Pressable> */}
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
