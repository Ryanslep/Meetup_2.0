import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, FlatList, ScrollView } from 'react-native';
import userApi from '../api/userApi';
import eventApi from '../api/eventApi';
import EventInfo from './EventInfo';
import RSVPList from './RSVPList';
import InterestedList from './InterestedList';
import EventPictures from './EventPictures';

const EventDetails = ({ route }) => {
  const { event } = route.params;
  const [hostData, setHostData] = useState(null);
  const [rsvps, setRsvps] = useState(null);
  const [interested, setInterested] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Event Details Host: ', event.host.username)
      const host = await userApi.getUserInfo(event.host._id);
      const rsvpsData = await eventApi.getRsvpList(event._id);
      const interestedData = await eventApi.getInterestedList(event._id);
      console.log('Event Details Host Username: ',host)
      setHostData(host);
      setRsvps(rsvpsData);
      setInterested(interestedData);
    };

    fetchData();
  }, [event.host, event._id]);

  return (
    <ScrollView>
      <View style={styles.container}>
        <EventPictures pictures={event.pictures} />
        {hostData && (
            <EventInfo event={event} hostData={hostData} />
        )}
            
        <View style={styles.tagContainer}>
          <Text style={styles.headerText}>Tags</Text>
          <View style={styles.tagList}>
            {event.tags && event.tags.length > 0 ? (
              event.tags.map((tag, index) => (
                <Text key={index} style={styles.tag}>
                  {tag}
                </Text>
              ))
            ) : (
              <Text>No tags available</Text>
            )}
          </View>
        </View>

        <RSVPList rsvps={rsvps} />
        <InterestedList interested={interested} />
      </View>
    </ScrollView>
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
    tagContainer: {
        marginBottom: 20,
    },
    tagList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    tag: {
        backgroundColor: '#ddd',
        padding: 5,
        borderRadius: 8,
        marginRight: 5,
        marginBottom: 5,
    },
});

export default EventDetails;
