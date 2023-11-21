import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Alert } from 'react-native';
import { localDate, localTime } from '../utils/formatFunctions';
import { useNavigation } from '@react-navigation/native';
import eventApi from '../api/eventApi';

const EventCard = ({ event, userId, setMyRsvps, setMyEvents, setBrowseEvents }) => {
  const navigation = useNavigation();
  const handleViewDetails = () => {
    // Navigate to the EventDetails screen with the event prop
    navigation.navigate('Event Details', { event });
  };
  const handleRSVP = () => {
    // Capture the current value of myRsvps before the promise resolves
  
    eventApi.rsvp(event._id, userId)
      .then(response => {
        console.log(response);
  
        if (response === "You are now attending this event") {
          // Add to myRsvps
          setMyRsvps((prevRsvps) => [...prevRsvps, event]);
        } else {
          // Take away from current myRsvps
          setMyRsvps((prevRsvps) => prevRsvps.filter((rsvp) => rsvp._id !== event._id));
        }
      })
      .catch(error => {
        console.error('Error RSVPing to event:', error);
      });
  };
  

  const handleDelete = async () => {
    if(event.host === userId) {
      const deleteEvent = await eventApi.delete(event._id, userId);
      if (deleteEvent.message === 'Event successfully deleted') {
        setMyEvents((prevEvents) => prevEvents.filter((item) => item._id !== event._id));
        setBrowseEvents((prevEvents) => prevEvents.filter((item) => item._id !== event._id));
        console.log('Event successfully deleted');
      } else {
        console.log('Issue deleting event');
      }
    }
  }

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{event.eventName}</Text>
        <Pressable onPress={handleViewDetails}>
          <Image source={require('../assets/viewDetails.png')} style={styles.icon} />
        </Pressable>

        {/* Conditionally render RSVP button and Message Buttons */}
        {userId !== event.host ?
          <>
            <Pressable onPress={handleRSVP}>
              <Image source={require('../assets/rsvp.png')} style={styles.icon} />
            </Pressable>
          </>
          :
          <Pressable onPress={handleDelete}>
            <Image source={require('../assets/delete.png')} style={styles.icon} />
          </Pressable>
        }
      </View>

      <Text>{event.description}</Text>
      <Text>{event.host}</Text>
      <Text>Date: {localDate(event.date)}</Text>
      <Text>Start Time: {localTime(event.startTime)}</Text>
      <Text>End Time: {localTime(event.endTime)}</Text>

      {event.pictures && event.pictures.length > 0 && (
        <View style={styles.imageContainer}>
          {event.pictures.map((picture, index) => (
            <Image key={index} source={{ uri: picture }} style={styles.image} />
          ))}
        </View>
      )}
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
  // Add more styles as needed
});

export default EventCard;
