import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import UserWithOptions from './UserWithOptions';
import userApi from '../api/userApi';
import { useAppContext } from './AppContext';

const RSVPList = ({ rsvps }) => {
  const { getCurrentUser } = useAppContext();

  return (
    <View>
      
      <Text style={styles.headerText}>RSVPs:</Text>
      {rsvps ? (
        <FlatList
          data={rsvps}
          keyExtractor={(item, index) => item._id + index.toString()}
          renderItem={({ item }) => (
            <UserWithOptions
              randomUser={item}
              senderId={getCurrentUser()._id}
              receiverId={item._id}
            />
          )}
        />
      ) : (
        <Text>Loading RSVPs...</Text>
      )}
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
