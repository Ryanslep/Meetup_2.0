import userApi from '../api/userApi';
import eventApi from '../api/eventApi';

exports.RSVP = async (event, userId, myRsvps, setMyRsvps) => {
    const rsvpAttempt = await eventApi.rsvp(event._id, userId);  
    if(rsvpAttempt == "RSVP") {
        setMyRsvps((prevRSVPs => [...prevRSVPs, eventId]))  
    } else {
        setMyRsvps((prevRsvps) => prevRsvps.filter((rsvp) => rsvp._id !== event._id)); 
    }
    return rsvpAttempt;
}

exports.Delete = (eventId, userId) => {

}