import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import EventCard from './EventCard';
import { useAppContext } from './AppContext';
import eventApi from '../api/eventApi';
import PlusIcon from '../assets/plus.png';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const BrowseScreen = () => {
    const navigation = useNavigation();

    const {
        user,
        setMyRsvps,
        setMyEvents,
        browseEvents,
        setBrowseEvents,
    } = useAppContext(); // Use the context hook

    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const eventData = await eventApi.getEvents();
            // Filter out events with status 'cancelled'
            const filteredEvents = eventData.filter(event => event.status !== 'cancelled');
            setBrowseEvents(filteredEvents);
          } catch (error) {
            console.error('Error fetching events:', error);
          }
        };
      
        fetchEvents();
      }, [setBrowseEvents]);
      

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => {
                    navigation.navigate('Create Event')
                }}
            >
                <Text style={styles.buttonText}>Create Event</Text>
                <Image source={PlusIcon} style={styles.plusIcon} />
            </TouchableOpacity>
            <ScrollView style={styles.scroll}>
                {browseEvents ? (
                    browseEvents.map((event) => (
                        <EventCard
                            key={event._id}
                            event={event}
                            userId={user._id}
                            setMyRsvps={setMyRsvps}
                            setMyEvents={setMyEvents}
                            setBrowseEvents={setBrowseEvents}
                            cardStyles={cardStyles}
                        />
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
    imageContainer: {
      height: hp('20%'), // Adjust the height as needed
      marginBottom: hp('12%'), // Add margin as needed
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

export default BrowseScreen;
