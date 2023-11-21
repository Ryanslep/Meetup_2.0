import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import UserWithOptions from './UserWithOptions';

const EventInfo = ({ event, hostData }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    const formatTime = (timeString) => {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
    };

    return (
        <View>
            <Text style={styles.headerText}>{event.eventName}</Text>

            <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{formatDate(event.date)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Start Time:</Text>
                <Text style={styles.value}>{formatTime(event.startTime)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>End Time:</Text>
                <Text style={styles.value}>{formatTime(event.endTime)}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Address:</Text>
                <Text style={styles.value}>{event.address}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Capacity:</Text>
                <Text style={styles.value}>{event.capacity} people</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>{event.description}</Text>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Host:</Text>
                {hostData ? (
                    <UserWithOptions
                        user={hostData}
                        onPressMessage={() => alert('Message Host')}
                        onPressBlock={() => alert('Block Host')}
                        onPressAddFriend={() => alert('Add Friend Host')}
                    />
                ) : (
                    <Text>Loading host data...</Text>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
});

export default EventInfo;
