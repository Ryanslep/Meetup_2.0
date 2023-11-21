import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import UserWithOptions from './UserWithOptions';
import userApi from '../api/userApi';
import TemporaryMessage from './TemporaryMessage'; // Import the new component
import { useAppContext } from './AppContext';

const RSVPList = ({ rsvps }) => {
  const { getCurrentUser } = useAppContext();
  const [tempMessage, setTempMessage] = useState(null);

  const showTemporaryMessage = (message) => {
    setTempMessage(message);
    setTimeout(() => {
      setTempMessage(null);
    }, 3000);
  };

  const onPressBlock = async (blockedUser) => {
    try {
      const currentUser = getCurrentUser();
      const userId = currentUser._id;

      const blocking = await userApi.blockUser(userId, blockedUser._id);

      if (blocking.message === 'User blocked successfully') {
        showTemporaryMessage(`Blocked user: ${blockedUser.username}`);
      } else if (blocking.message === 'User unblocked successfully') {
        showTemporaryMessage(`Unblocked user: ${blockedUser.username}`);
      }
    } catch (error) {
      showTemporaryMessage('Failed to block/unblock user');
      console.error('Error blocking/unblocking user:', error);
    }
  };

  return (
    <View>
      <Text style={styles.headerText}>RSVPs:</Text>
      {rsvps ? (
        <FlatList
          data={rsvps}
          keyExtractor={(item, index) => item._id + index.toString()}
          renderItem={({ item }) => (console.log('Item: ', item),
            <UserWithOptions
              user={item}
              sender={getCurrentUser()._id}
              receiver={item._id}
              onPressMessage={() => alert('Message RSVP')}
              onPressBlock={() => onPressBlock(item)}
              onPressAddFriend={() => alert('Add Friend RSVP')}
            />
          )}
        />
      ) : (
        <Text>Loading RSVPs...</Text>
      )}

      {tempMessage && <TemporaryMessage message={tempMessage} />}
    </View>
  );
};

const styles = StyleSheet.create({
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default RSVPList;
