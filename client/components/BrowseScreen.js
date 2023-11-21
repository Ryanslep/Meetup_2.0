// BrowseScreen.js
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import EventCard from './EventCard';
import NavButton from './NavButton';
import { useAppContext } from './AppContext'; // Import the context hook
import eventApi from '../api/eventApi';

const BrowseScreen = () => {
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
            <Text>Browse</Text>
            <NavButton title="Create Event" to="Create Event" />
            <ScrollView>
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
});

export default BrowseScreen;
