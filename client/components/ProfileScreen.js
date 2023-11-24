// ProfileScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ProfileBanner from './ProfileBanner';
import EventCard from './EventCard';
import { useAppContext } from './AppContext'; // Import the useAppContext hook
import userApi from '../api/userApi';

const ProfileScreen = () => {
  // Use the useAppContext hook to access the shared state
  const {
    user,
    setLoggedIn,
    myEvents,
    setMyEvents,
    myRsvps,
    setMyRsvps,
    setBrowseEvents,
  } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the user from context
        const eventsData = await userApi.getMyEvents(user._id);
        setMyEvents(eventsData || []); // Ensure eventsData is an array or default to an empty array
        const rsvpData = await userApi.getMyRsvps(user._id);
        setMyRsvps(rsvpData || []); // Ensure rsvpData is an array or default to an empty array
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error as needed, e.g., show an error message to the user
      }
    };

    fetchData();
  }, [user._id, setMyEvents, setMyRsvps]);

  return (
    <ScrollView style={styles.container}>
      <ProfileBanner user={user} setLoggedIn={setLoggedIn} />

      <View>
        <Text style={styles.label}>Hosting</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
          {myEvents &&
            myEvents.map((event) => (
              <EventCard key={event._id} event={event} userId={user && user._id} setMyEvents={setMyEvents} setMyRsvps={setMyRsvps} setBrowseEvents={setBrowseEvents} />
            ))}
        </ScrollView>
      </View>

      <View>
        <Text style={styles.label}>Attending</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scrollView}>
            {myRsvps &&
              myRsvps.map((event) => (
                <EventCard key={event._id} event={event} userId={user && user._id} setMyEvents={setMyEvents} setMyRsvps={setMyRsvps} setBrowseEvents={setBrowseEvents} />
              ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  scrollView: {
    width: '100%',
  },
});

export default ProfileScreen;
