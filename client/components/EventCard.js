import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { localDate, localTime } from '../utils/formatFunctions';
import { useNavigation } from '@react-navigation/native';
import eventApi from '../api/eventApi';
import { useAppContext } from './AppContext';
import Toast from 'react-native-root-toast';
import EventPictures from './EventPictures';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
const EventCard = ({ event }) => {
  const {
    myRsvps,
    myEvents,
    setMyEvents,
    user,
    setMyRsvps,
    setBrowseEvents,
  } = useAppContext();
  const navigation = useNavigation();

  const handleViewDetails = () => {
    navigation.navigate('Event Details', { event });
  };

  const showToast = (message, backgroundColor) => {
    Toast.show(message, {
      duration: Toast.durations.SHORT,
      position: -80,
      shadow: true,
      backgroundColor,
      animation: true,
    });
  };

  const handleRSVP = async () => {
    try {
      const rsvpAttempt = await eventApi.rsvp(event._id, user._id);
      if (rsvpAttempt === 'RSVP') {
        showToast(`You are now attending ${event.eventName}!`, 'green');
        setMyRsvps([...myRsvps, event]);
      } else {
        showToast(`No longer attending ${event.eventName}!`, 'orangered');
        setMyRsvps(myRsvps.filter((rsvp) => rsvp._id !== event._id));
      }
      return rsvpAttempt;
    } catch (err) {
      showToast(`${event.eventName} no longer exists!`, 'red');
    }
  };

  const handleDelete = async () => {
    try {
      const attemptDelete = await eventApi.delete(event._id, user._id);

      if (attemptDelete.message === 'Deleted') {
        setMyEvents(myEvents.filter((myEvent) => myEvent._id !== event._id));
        setBrowseEvents((prevEvents) =>
          prevEvents.filter((prevEvent) => prevEvent._id !== event._id)
        );

        showToast(`${event.eventName} successfully deleted!`, 'red');
      }
      return attemptDelete;
    } catch (err) {
      console.error('Error deleting event:', err);
      showToast(`${event.eventName} no longer exists`, 'red');
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{event.eventName}</Text>

        <Pressable onPress={handleViewDetails}>
          <Image
            source={require('../assets/viewDetails.png')}
            style={styles.icon}
          />
        </Pressable>

        {user._id !== event.host._id ? (
          <Pressable onPress={() => handleRSVP(event._id)}>
            <Image source={require('../assets/rsvp.png')} style={styles.icon} />
          </Pressable>
        ) : (
          <Pressable onPress={handleDelete}>
            <Image
              source={require('../assets/delete.png')}
              style={styles.icon}
            />
          </Pressable>
        )}
      </View>
      {event.pictures && event.pictures.length > 0 && (
        <EventPictures pictures={event.pictures} />
      )}

      <Text>{event.description}</Text>
      <Text>{event.host.username}</Text>
      <Text>Date: {localDate(event.date)}</Text>
      <Text>Start Time: {localTime(event.startTime)}</Text>
      <Text>End Time: {localTime(event.endTime)}</Text>

    </View>
  );
};

const styles = StyleSheet.create({
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
  icon: {
    width: 24,
    height: 24,
  },
  imageContainer: {
    height: hp('20%'), // Adjust the height as needed
    marginBottom: 8, // Add margin as needed
  },
  swiper: {
    height: hp('100%'), // Take the full height of the container
  },
  image: {
    height: '100%', // Take the full height of the Swiper
    width: wp('100%'), // Take the full width of the Swiper
    borderRadius: 8, // Adjust the border radius as needed
  },
});

export default EventCard;