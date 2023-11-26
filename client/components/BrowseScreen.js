import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import EventCard from './EventCard';
import { useAppContext } from './AppContext';
import eventApi from '../api/eventApi';
import PlusIcon from '../assets/plus.png';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import CustomSearchBar from './CustomSearchBar';
import Filters from './Filters';

const BrowseScreen = () => {
  const navigation = useNavigation();

  const {
    user,
    browseEvents,
    setBrowseEvents,
  } = useAppContext(); // Use the context hook

  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventData = await eventApi.getEvents();
        // Filter out events with status 'cancelled'
        const filteredEvents = eventData.filter(event => event.status !== 'cancelled');

        const searchedEvents = filteredEvents.filter(event =>
          event.eventName.toLowerCase().includes(search.toLowerCase()) ||
          event.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
        );

        setBrowseEvents(searchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [search, setBrowseEvents]);

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <CustomSearchBar search={search} updateSearch={setSearch} />
        <Filters />
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => {
          navigation.navigate('Create Event');
        }}
      >
        <Text style={styles.buttonText}>Create Event</Text>
        <Image source={PlusIcon} style={styles.plusIcon} />
      </TouchableOpacity>
      <ScrollView style={styles.scroll}>
        {browseEvents ? (
          browseEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <Text>Issue Retrieving Events from the database</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    width: wp('95%'),
    maxWidth: 1000,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    padding: 8,
    backgroundColor: 'black',
    margin: 10,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5, // For Android
  },
  buttonText: {
    color: 'white',
    marginRight: 8,
  },
  plusIcon: {
    width: 20,
    height: 20,
    tintColor: 'white',
  },
  filterContainer: {
    width: wp('100%'), // Ensure the filter container takes the entire width
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default BrowseScreen;