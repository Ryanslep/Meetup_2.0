// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import ProfileBanner from './ProfileBanner';
import EventList from './EventList';
import { useAppContext } from './AppContext';
import userApi from '../api/userApi';
import { useFocusEffect } from '@react-navigation/native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const ProfileScreen = () => {
  const {
    user,
    setLoggedIn,
    myEvents,
    setMyEvents,
    myRsvps,
    setMyRsvps,
    myInterested,
    setMyInterested,
  } = useAppContext();

  const [selectedSection, setSelectedSection] = useState('all'); // Set 'all' as the default tab

  const fetchData = async () => {
    try {
      const eventsData = await userApi.getMyEvents(user._id);
      setMyEvents(eventsData || []);
      const rsvpData = await userApi.getMyRsvps(user._id);
      setMyRsvps(rsvpData || []);
      const interestedData = await userApi.getMyInterested(user._id);
      setMyInterested(interestedData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user._id, setMyEvents, setMyRsvps]);

  useFocusEffect(
    React.useCallback(() => {
      fetchData();
    }, [user._id])
  );

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  return (
    <ScrollView style={styles.container}>
      <ProfileBanner user={user} setLoggedIn={setLoggedIn} />

      <View style={styles.sectionToggleContainer}>
        {/* New 'All' tab */}
        <Pressable onPress={() => handleSectionChange('all')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={selectedSection === 'all' ? styles.selectedToggleText : styles.toggleText}>All</Text>
        </Pressable>

        <Pressable onPress={() => handleSectionChange('hosting')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={selectedSection === 'hosting' ? styles.selectedToggleText : styles.toggleText}>Hosting</Text>
        </Pressable>

        <Pressable onPress={() => handleSectionChange('attending')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={selectedSection === 'attending' ? styles.selectedToggleText : styles.toggleText}>Attending</Text>
        </Pressable>

        <Pressable onPress={() => handleSectionChange('interested')} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
          <Text style={selectedSection === 'interested' ? styles.selectedToggleText : styles.toggleText}>Interested</Text>
        </Pressable>
      </View>

      {/* Display EventList based on the selected section */}
      <View style={styles.eventsContainer}>
        {/* New condition for 'All' tab */}
        {selectedSection === 'all' && (
          <EventList
            events={
              (myEvents || []).concat(myRsvps || [], myInterested || [])
            }
            title="All"
          />
        )}
        {selectedSection === 'hosting' && (
          <EventList
            events={(myEvents || []).filter(event => event.status !== 'cancelled')}
            title="Hosting"
          />
        )}
        {selectedSection === 'attending' && (
          <EventList
            events={(myRsvps || []).filter(event => event.status !== 'cancelled')}
            title="Attending"
          />
        )}
        {selectedSection === 'interested' && (
          <EventList
            events={(myInterested || []).filter(event => event.status !== 'cancelled')}
            title="Interested"
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: hp('1%'),
  },
  eventsContainer: {
    width: wp('90%'),
    marginLeft: wp('5%'),
    marginRight: wp('5%'),
  },
  sectionToggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  toggleText: {
    color: '#000',
    padding: 10,
  },
  selectedToggleText: {
    color: '#00f',
    padding: 10,
  },
});

export default ProfileScreen;