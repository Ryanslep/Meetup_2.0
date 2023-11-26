// EventList.js
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import EventCard from './EventCard';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useAppContext } from './AppContext';

const EventList = ({ events, cardStyles, title }) => {
  const {user, setMyEvents, setMyRsvps, setBrowseEvents} = useAppContext();
  return (
    <View>
      <Text style={styles.label}>{title}</Text>
      {events && events.length > 0 ? (
        <ScrollView style={styles.scrollView}>
          {events.map((event) => (
            <EventCard
              cardStyles={cardStyles}
              key={event._id}
              event={event}
              userId={user && user._id}
              setMyEvents={setMyEvents}
              setMyRsvps={setMyRsvps}
              setBrowseEvents={setBrowseEvents}
            />
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.text}>Not {title.toLowerCase()} any events</Text>
      )}
    </View>
  );
};

const styles = {
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginTop: hp('2%'),
  },
  scrollView: {
    width: wp('90%'),
  },
  text: {
    fontSize: 16,
    color: 'black',
    marginTop: hp('2%'),
  },
};

export default EventList;
