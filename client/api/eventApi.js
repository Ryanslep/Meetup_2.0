import { apiBaseUrl } from '../utils/apiUtils';
import { localTime, localDate } from '../utils/formatFunctions';

const eventApi = {
  getEvent: async (eventId) => {
    const response = await fetch(`${apiBaseUrl}/event/fetch/${eventId}`);

    const events = await response.json();
    return events;
  },
  getEvents: async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/event/fetch`);
      const events = await response.json();

      return events;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error; // Rethrow the error to handle it in the component
    }
  },
  create: async (formData) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      };

      const response = await fetch(`${apiBaseUrl}/event/create`, requestOptions);

      if (!response.ok) {
        throw new Error(`Failed to create event. Status: ${response.status}`);
      }

      const event = await response.json();
      return event;
    } catch (error) {
      console.error('Error creating event:', error.message);
      throw error; // Re-throw the error for the caller to handle
    }
  },


  update: async (eventId, formData) => {
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    }

    const response = await fetch(`${apiBaseUrl}/event/update/${eventId}`, requestOptions);
    const updatedEvent = await response.json();
    return updatedEvent;
  },

  rsvp: async (eventId, userId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/event/rsvp/${eventId}/${userId}`, {
        method: 'POST',
      });
  
      if (response.ok) {
        if (response.status === 200) {
          return 'RSVP';
        }
        if (response.status === 201) {
          return 'UNRSVP';
        }
      } else {
        const error = await response.json();
        throw new Error(error.message);
      }
    } catch (error) {
      console.error('Error RSVPing to event:', error);
      throw new Error('Failed to RSVP to event');
    }
  },
  

  delete: async (eventId, userId) => {
    const requestOptions = {
      method: 'DELETE', // Change this to 'DELETE'
      headers: { 'Content-Type': 'application/json' },
    };

    const response = await fetch(`${apiBaseUrl}/event/delete/${eventId}/${userId}`, requestOptions); // Adjust the endpoint

    if (response.status === 200) {
      const result = await response.json();
      return result;
    } else {
      throw new Error('Failed to delete event');
    }
  },
  reportEvent: async (eventId, reportData) => {
    try {
      const response = await fetch(`${apiBaseUrl}/event/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId,
          reportData,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Error reporting event:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  },
  getRsvpList: async (eventId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/event/${eventId}/rsvps`);
      if (!response.ok) {
        throw new Error('Failed to fetch RSVP list');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching RSVP list:', error);
      throw error;
    }
  },
}

export default eventApi;