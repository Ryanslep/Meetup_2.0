// ProfileScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import ProfileBanner from './ProfileBanner';
import EventCard from './EventCard';
import { useAppContext } from './AppContext'; // Import the useAppContext hook
import userApi from '../api/userApi';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
    myInterested,
    setMyInterested,
  } = useAppContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Use the user from context
        const eventsData = await userApi.getMyEvents(user._id);
        console.log(eventsData)
        setMyEvents(eventsData || []); // Ensure eventsData is an array or default to an empty array
        const rsvpData = await userApi.getMyRsvps(user._id);
        setMyRsvps(rsvpData || []); // Ensure rsvpData is an array or default to an empty array
        const interestedData = await userApi.getMyInterested(user._id);
        setMyInterested(interestedData)
        console.log(interestedData)
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle the error as needed, e.g., show an error message to the user
      }
    };

    fetchData();
  }, [user._id, setMyEvents, setMyRsvps]);
  console.log('Length: ', myEvents)

  return (
    <ScrollView style={styles.container}>
      <ProfileBanner user={user} setLoggedIn={setLoggedIn} />
      <Text style={styles.label}>Hosting</Text>
      {myEvents  && myEvents.length > 0 ?
        <View style={styles.row}>
          <ScrollView style={styles.scrollView}>
            {
              myEvents.map((event) => (
                <EventCard cardStyles={cardStyles} key={event._id} event={event} userId={user && user._id} setMyEvents={setMyEvents} setMyRsvps={setMyRsvps} setBrowseEvents={setBrowseEvents} />
              ))}
          </ScrollView>
        </View>
        :
        <Text>Not hosting any events</Text>
}
      <Text style={styles.label}>Attending</Text>
      {myRsvps  && myRsvps.length > 0 ? 
        <View style={styles.row}>

          <ScrollView style={styles.scrollView}>

            {myRsvps.map((event) => (
              <EventCard cardStyles={cardStyles} key={event._id} event={event} userId={user && user._id} setMyEvents={setMyEvents} setMyRsvps={setMyRsvps} setBrowseEvents={setBrowseEvents} />
            ))}
          </ScrollView>
        </View>
        :
        <Text>Not Attending any events</Text> 
      }

      <Text style={styles.label}>Interested</Text>
      {myInterested  && myInterested.length > 0 ?
        <View style={styles.row}>
          <ScrollView style={styles.scrollView}>
            {
              myInterested.map((event) => (
                <EventCard cardStyles={cardStyles} key={event._id} event={event} userId={user && user._id} setMyEvents={setMyEvents} setMyRsvps={setMyRsvps} setBrowseEvents={setBrowseEvents} />
              ))}
          </ScrollView>
        </View>
        :
        <Text>Not interested in any events</Text>
      }
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingLeft: 10,
    // paddingRight: 10,
    marginLeft: wp('2%'),
    marginRight: wp('2%'),
    marginBottom: hp('1%')

  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'black',
  },
  scrollView: {
    width: wp('96%'),
    // height: hp('25%')
  },
  row: {
    // height: hp
  }
});

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    margin: 8,
    elevation: 2,
    // height: hp('25%')
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
  icon: {
    width: 24,
    height: 24,
  },
  imageContainer: {
    // height: hp('50%'), // Adjust the height as needed
    // marginBottom: hp('12%'), // Add margin as needed
  },
  swiper: {
    height: hp('100%'), // Take the full height of the container
  },
  image: {
    height: '100%', // Take the full height of the Swiper
    width: wp('100%'), // Take the full width of the Swiper
    borderRadius: 8, // Adjust the border radius as needed
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
})

export default ProfileScreen;
