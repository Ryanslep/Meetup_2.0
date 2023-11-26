import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { localDate, localTime } from '../utils/formatFunctions';
import EventPictures from './EventPictures';
import DisplayTags from './DisplayTags';

const EventDetailsModal = ({ isVisible, event, onClose }) => {
  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose}>
      <View style={styles.modalContent}>
        <View style={styles.imageContainer}>
          {event.pictures && event.pictures.length > 0 && (
            <EventPictures pictures={event.pictures} />
          )}
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{event.eventName}</Text>
          <Text>{event.description}</Text>
          <Text>{localDate(event.date)} @ {localTime(event.startTime)} - {localTime(event.endTime)}</Text>
          <Text>{event.location}</Text>
          {event.tags && event.tags.length > 0 && (
            <DisplayTags tags={event.tags} />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
  },
  imageContainer: {
    marginBottom: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default EventDetailsModal;
