import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, Pressable, FlatList, Image } from 'react-native';
import userApi from '../api/userApi';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './AppContext'; // Import the context hook

const Preferences = () => {
  const navigation = useNavigation();
  const { user } = useAppContext(); // Use the context hook to get the user

  const [preferences, setPreferences] = useState(null);
  // const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUserPreferences = async () => {
      const preferenceData = await userApi.getPreferences(user._id);
      setPreferences(preferenceData);
    };
    fetchUserPreferences();
  }, [user._id]);

  const handleToggleNotifications = () => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      receiveNotifications: !prevPreferences.receiveNotifications,
    }));
  };

  const handleToggleRSVPVisibility = () => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      rsvpVisibility: !prevPreferences.rsvpVisibility,
    }));
  };

  const handleSavePreferences = async () => {
    try {
      await userApi.savePreferences(user._id, preferences);
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  return (
    <View style={styles.container}>
      {!preferences ? <Text>Loading Preferences</Text> :
        <View>
          <Text style={styles.title}>My Preferences</Text>
          {/* Receive notifications */}
          <View style={styles.preferenceContainer}>
            <Text style={styles.label}>Receive Notifications</Text>
            <Switch
              value={preferences.receiveNotifications}
              onValueChange={handleToggleNotifications}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={preferences.receiveNotifications ? '#f5dd4b' : '#f4f3f4'}
            />
          </View>
          {/* Rsvp Visibility */}
          <View style={styles.preferenceContainer}>
            <Text style={styles.label}>RSVP Visibility</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch
                value={preferences.rsvpVisibility}
                onValueChange={handleToggleRSVPVisibility}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={preferences.rsvpVisibility ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
          </View>
          {/* Block users */}
          <View>
            <Text>Blocked Users: </Text>
            {user.blockedUsers.length > 0 ? (
              <FlatList
                data={user.blockedUsers}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.blockedUserContainer}>
                    <Text style={styles.username}>{item.username}</Text>
                    <Pressable onPress={() => handleUnblockUser(item._id)}>
                      <Image source={require('../assets/delete.png')} style={styles.deleteIcon} />
                    </Pressable>
                  </View>
                )}
              />
            ) : (
              <Text>No users blocked</Text>
            )}

          </View>

          {/* Save Preferences Button */}
          <Pressable onPress={handleSavePreferences} style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </Pressable>
        </View>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  preferenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
  },
  blockButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  blockButtonText: {
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 2,
    color: 'white',
  },
  blockedUserContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  username: {
    fontSize: 16,
  },
  deleteIcon: {
    width: 20,
    height: 20,
  },
});

export default Preferences;
