import React, { useEffect, useState } from 'react';
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
import EventActionButton from './EventActionButton';

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

  myEvents.map(event => console.log(event.status))

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

  const handleEventCancel = async () => {
    try {
      const cancelAttempt = await eventApi.cancel(event._id);
      console.log(cancelAttempt)
      if (cancelAttempt.message === 'cancelled') {
        // Update the status to 'cancelled' in myEvents
        setMyEvents((prevMyEvents) =>
          prevMyEvents.map((myEvent) =>
            myEvent._id === event._id ? { ...myEvent, status: 'cancelled' } : myEvent
          )
        );
        console.log('Event cancelled successfully.');
      } else {
        console.log('Cancellation unsuccessful:', cancelAttempt.message);
      }
    } catch (error) {
      console.error('Error cancelling event:', error);
    }
  };
  

  const handleReactivate = async () => {
    try {
      const reactivateAttempt = await eventApi.reactivate(event._id);
      if (reactivateAttempt.message === 'active') {
        // Update the status to 'cancelled' in myEvents
        setMyEvents((prevMyEvents) =>
          prevMyEvents.map((myEvent) =>
            myEvent._id === event._id ? { ...myEvent, status: 'active' } : myEvent
          )
        );
        console.log('Event reactivated successfully.');
      } else {
        console.log('Reactivation unsuccessful:', cancelAttempt.message);
      }
    } catch (error) {
      console.error('Error reactivating event:', error);
    }
  }

  const renderDeleteButton = () => {
    if (user._id === event.host._id) {
      // If the user is the host
      console.log('rsvpLength: ', event.rsvps.length);
      console.log('interestedLength: ', event.interested.length);
  
      if (event.status === 'cancelled') {
        // Display "Reactivate Event" button with the status "Cancelled"
        return (
          <EventActionButton
            onPress={handleReactivate}
            icon={require('../assets/reactivate.png')}
            text={`Reactivate Event (${event.status})`}
          />
        );
      } else if (event.rsvps.length > 0 || event.interested.length > 0) {
        // Display "Cancel Event" button with a different icon
        return (
          <EventActionButton
            onPress={handleEventCancel}
            icon={require('../assets/cancel.png')}
            text={`Cancel Event (${event.status})`}
          />
        );
      } else {
        // Display "Delete Event" button with the default icon
        return (
          <EventActionButton
            onPress={handleDelete}
            icon={require('../assets/delete.png')}
            text={`Delete Event (${event.status})`}
          />
        );
      }
    }
    return null; // No button to display if the user is not the host
  };
  
  const styles = StyleSheet.create(cardStyles);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <EventActionButton onPress={handleViewDetails} icon={require('../assets/viewDetails.png')} text="View Details" />

        {user._id !== event.host._id && (
          <>
            <EventActionButton
              onPress={() => handleRSVP(event._id)}
              icon={myRsvps.some(rsvp => rsvp._id === event._id) ? checkIcon : require('../assets/rsvp.png')}
              text={myRsvps.some(rsvp => rsvp._id === event._id) ? 'Attending' : 'RSVP'}
            />

            {!myRsvps.some(rsvp => rsvp._id === event._id) && (
              <EventActionButton
                onPress={handleInterested}
                icon={myInterested.some(interested => interested._id === event._id) ? checkIcon : plusIcon}
                text="Interested"
              />
            )}
          </>
        )}

        {renderDeleteButton()}
      </View>
      {event.pictures && event.pictures.length > 0 && (
        <View style={styles.imageContainer}>
          <EventPictures pictures={event.pictures} />
        </View>
      )}

      <View style={styles.row}>
        <Text style={styles.title}>{event.eventName}</Text>
      </View>

      <Modal isVisible={isDeleteModalVisible} onBackdropPress={() => setDeleteModalVisible(false)}>
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