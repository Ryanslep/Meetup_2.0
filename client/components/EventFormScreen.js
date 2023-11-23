import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView } from 'react-native';
import FlexInput from './FlexInput';
import SubmitButton from './SubmitButton';
import DatePicker from './DatePicker';
import TimePicker from './TimePicker';
import eventApi from '../api/eventApi';
import MultiImagePicker from './MultiImagePicker';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';
import { useAppContext } from './AppContext';

const EventFormScreen = () => {
  const navigation = useNavigation();
  const { user, setMyEvents, setBrowseEvents } = useAppContext();

  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [capacity, setCapacity] = useState('');
  const [address, setAddress] = useState('');
  const [images, setImages] = useState(null);
  const [capacityError, setCapacityError] = useState('');

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
  };

  const handleStartTimeChange = (selectedTime) => {
    setStartTime(selectedTime);
  };

  const handleEndTimeChange = (selectedTime) => {
    setEndTime(selectedTime);
  };

  const handleImagesSelected = async (selectedImages) => {
    try {
      const imageUris = selectedImages.map((image) => image.uri);
      console.log('Selected Image URIs:', imageUris);
  
      // Convert image URIs to base64 for Android using Expo's ImageManipulator
      const imageFiles = await Promise.all(
        imageUris.map(async (uri) => {
          const manipulatedImage = await ImageManipulator.manipulateAsync(
            uri,
            [{ resize: { width: 500 } }], // You can adjust the options as needed
            { base64: true }
          );
  
          return `data:image/jpeg;base64,${manipulatedImage.base64}`;
        })
      );
  
      // Store the base64-encoded data in state
      setImages(imageFiles);
    } catch (error) {
      console.error('Error converting images:', error);
    }
  };

  const handleSubmit = async () => {
    const capacityNumber = parseInt(capacity, 10);

    if (isNaN(capacityNumber) || capacityNumber <= 0) {
      setCapacityError('Please enter a valid capacity (a positive number).');
      return;
    } else {
      setCapacityError('');
    }
    // Create an event object
    const newEvent = {
      host: user._id, // Assuming user is the logged-in user from the context
      eventName,
      description,
      date: date.toISOString(),
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      address,
      capacity: capacity, // Convert capacity to a number
      pictures: images
    };
    // Call the onSubmit function with the new event
    const createdEvent = await eventApi.create(newEvent);
    setMyEvents((prevEvents) => [...prevEvents, createdEvent])
    setBrowseEvents((prevEvents) => [...prevEvents, createdEvent])

    navigation.navigate('Event Details', {event: createdEvent})
  };


  return (
    <ScrollView>
      <View style={styles.container}>
        <Text>Event Name</Text>
        <FlexInput
          placeholder="Event Name"
          value={eventName}
          onChangeText={(text) => setEventName(text)}
        />

        <Text>Description</Text>
        <FlexInput
          placeholder="Description"
          value={description}
          onChangeText={(text) => setDescription(text)}
        />

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Date</Text>
          <DatePicker label="Date" date={date} onChange={handleDateChange} />
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>Start Time</Text>
          <TimePicker label="Start Time" time={startTime} onChange={handleStartTimeChange} />
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateLabel}>End Time</Text>
          <TimePicker label="End Time" time={endTime} onChange={handleEndTimeChange} />
        </View>

        <Text>Address</Text>
        <FlexInput
          placeholder="Address"
          value={address}
          onChangeText={(text) => setAddress(text)}
        />

        <Text>Capacity</Text>
        <FlexInput
          placeholder="Capacity"
          value={capacity}
          onChangeText={(text) => setCapacity(text)}
          keyboardType="numeric"
        />
        {capacityError ? <Text style={styles.errorText}>{capacityError}</Text> : null}

        <MultiImagePicker onImagesSelected={handleImagesSelected} />

        <SubmitButton style={styles.submit} title="Submit" onPress={handleSubmit} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between', // Align children with space in between
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
  },
  dateLabel: {
    marginRight: 10,
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10, // Add vertical margin
  },
  image: {
    width: 125, // Set the desired width
    height: 125, // Set the desired height
  },
  submit: {
    marginBottom: 20, // Add some margin at the bottom
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default EventFormScreen;
