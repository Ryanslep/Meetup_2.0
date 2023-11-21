import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList } from 'react-native';
import userApi from '../api/userApi';
import eventApi from '../api/eventApi';
import EventInfo from './EventInfo';
import RSVPList from './RSVPList';
import EventPictures from './EventPictures';


const EventDetails = ({ route }) => {
    const { event } = route.params;
    const [hostData, setHostData] = useState(null);
    const [rsvps, setRsvps] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const host = await userApi.getUserInfo(event.host)
            // Replace with your actual API call for fetching RSVPs
            const rsvpsData = await eventApi.getRsvpList(event._id)
            setHostData(host);
            setRsvps(rsvpsData);
        }

        fetchData();
    }, [event.host, event._id]);

    return (
        <View style={styles.container}>
            <EventPictures pictures={event.pictures} />
            <EventInfo event={event} hostData={hostData} />

            <RSVPList rsvps={rsvps} />

            {/* ... (other details) */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
        marginRight: 10,
    },
    value: {
        flex: 1,
    },
    imageContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 10,
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
    },
    hostContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderRadius: 12,
        padding: 8,
        flex: 1,
    },
    username: {
        marginRight: 10,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    icon: {
        width: 20,
        height: 20,
        marginLeft: 5,
    },
    rsvpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default EventDetails;
