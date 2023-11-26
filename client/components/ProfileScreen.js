// ProfileScreen.js
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Text } from 'react-native';
import ProfileBanner from './ProfileBanner';
import EventList from './EventList';
import { useAppContext } from './AppContext';
import userApi from '../api/userApi';
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

  useEffect(() => {
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

    fetchData();
  }, [user._id, setMyEvents, setMyRsvps]);

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
            cardStyles={cardStyles}
            title="All"
          />
        )}
        {selectedSection === 'hosting' && (
          <EventList
            events={(myEvents || []).filter(event => event.status !== 'cancelled')}
            cardStyles={cardStyles}
            title="Hosting"
          />
        )}
        {selectedSection === 'attending' && (
          <EventList
            events={(myRsvps || []).filter(event => event.status !== 'cancelled')}
            cardStyles={cardStyles}
            title="Attending"
          />
        )}
        {selectedSection === 'interested' && (
          <EventList
            events={(myInterested || []).filter(event => event.status !== 'cancelled')}
            cardStyles={cardStyles}
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

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  swiper: {
    height: hp('100%'),
  },
  image: {
    height: '100%',
    width: wp('100%'),
    borderRadius: 8,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  hostProfilePic: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
  },
  hostUsername: {
    fontSize: 16,
    fontWeight: 'bold',
  },
})

export default ProfileScreen;