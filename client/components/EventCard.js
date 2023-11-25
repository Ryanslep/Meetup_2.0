import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, TouchableOpacity } from 'react-native';
import { localDate, localTime } from '../utils/formatFunctions';
import { useNavigation } from '@react-navigation/native';
import eventApi from '../api/eventApi';
import { useAppContext } from './AppContext';
import Toast from 'react-native-root-toast';
import EventPictures from './EventPictures';
import Modal from 'react-native-modal';
import checkIcon from '../assets/check.png'
import plusIcon from '../assets/plus.png';

const EventCard = ({ event, cardStyles }) => {
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);

  const {
    myRsvps,
    myEvents,
    setMyEvents,
    user,
    setMyRsvps,
    myInterested,
    setMyInterested,
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

        // Remove the event from myInterested
        const updatedInterested = myInterested.filter(interestedEvent => interestedEvent._id !== event._id);
        setMyInterested(updatedInterested);

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


  const handleInterested = async () => {
    const interestedAttempt = await eventApi.setInterested(event._id, user._id);
    if (interestedAttempt.message == 'Deleted') {
      setMyInterested(myInterested.filter((item) => item._id !== event._id));
      showToast(`No longer intersted in ${event.eventName}!`, 'orangered');
    }
    else {
      setMyInterested([...myInterested, event]);
      showToast(`You are now interested in ${event.eventName}!`, 'green');

    }
  };

  const handleDelete = () => {
    setDeleteModalVisible(true);
  };


  const handleConfirmDelete = async () => {
    setDeleteModalVisible(false);

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

    await handleDelete;
  };

  const styles = StyleSheet.create(cardStyles);


  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Pressable onPress={handleViewDetails} style={styles.button}>
          <Image
            source={require('../assets/viewDetails.png')}
            style={styles.icon}
          />
          <Text>View Details</Text>
        </Pressable>

        {user._id !== event.host._id && (
  <>
    <Pressable onPress={() => handleRSVP(event._id)} style={styles.button}>
      {myRsvps.some(rsvp => rsvp._id === event._id) ? (
        <>
          <Image source={checkIcon} style={styles.icon} />
          <Text>Attending</Text>
        </>
      ) : (
        <>
          <Image
            source={require('../assets/rsvp.png')}
            style={styles.icon}
          />
          <Text>RSVP</Text>
        </>
      )}
    </Pressable>

    {!myRsvps.some(rsvp => rsvp._id === event._id) && (
      <Pressable onPress={handleInterested} style={styles.button}>
        {myInterested.some(interested => interested._id === event._id) ? (
          <>
            <Image source={checkIcon} style={styles.icon} />
            <Text>Interested</Text>
          </>
        ) : (
          <>
            <Image source={plusIcon} style={styles.icon} />
            <Text>Interested</Text>
          </>
        )}
      </Pressable>
    )}
  </>
)}

        {user._id === event.host._id && (
          <Pressable onPress={handleDelete} style={styles.button}>
            <Image
              source={require('../assets/delete.png')}
              style={styles.icon}
            />
            <Text>Delete Event</Text>
          </Pressable>
        )}
      </View>
      {event.pictures && event.pictures.length > 0 && (
        <View style={styles.imageContainer}>

          <EventPictures pictures={event.pictures} />
        </View >
      )}

      <View style={styles.row}>
        <Text style={styles.title}>{event.eventName}</Text>
      </View>

      <Modal isVisible={isDeleteModalVisible} onBackdropPress={() => setDeleteModalVisible(false)} >
        <View style={styles.modalContent}>
          <Text>Are you sure you want to delete {event.eventName}?</Text>
          <View style={styles.modalButtons}>
            <Pressable onPress={handleConfirmDelete}>
              <Text>Yes</Text>
            </Pressable>
            <Pressable onPress={() => setDeleteModalVisible(false)}>
              <Text>No</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Text>{event.description}</Text>
      <Text>{localDate(event.date)} @ {localTime(event.startTime)} - {localTime(event.endTime)}</Text>
    </View>
  );
};


// Styles are imported from either browseScreen or profileScreen

export default EventCard;