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
                setBrowseEvents(eventData);
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
        width: wp('80%'),
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

export default BrowseScreen;
