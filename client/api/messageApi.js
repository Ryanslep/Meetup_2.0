import { apiBaseUrl } from "../utils/apiUtils";

const messageApi = {
  sendMessage: async ({ sender, receiver, text }) => {
    try {
      const response = await fetch(`${apiBaseUrl}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: sender.toString(), // Convert sender to a string
          receiver: receiver.toString(), // Convert receiver to a string
          text,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Error sending message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Error sending message');
    }
  },

  getMessageHistory: async (userId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/messages/history/${userId}`);

      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Error fetching message history');
      }
    } catch (error) {
      console.error('Error fetching message history:', error);
      throw new Error('Error fetching message history');
    }
  },

  // You can add more functions for handling media, location, etc. if needed.
};

export default messageApi;
