// api/messageApi.js

import { apiBaseUrl } from "../utils/apiUtils";

const messageApi = {
  sendMessage: async ({ sender, receiver, text }) => {
    try {
      const response = await fetch(`${apiBaseUrl}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sender, receiver, text }),
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

  getThread: async (senderId, receiverId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/messages/${senderId}/${receiverId}`);
      const data = await response.json();

      if (response.ok) {
        return data;
      } else {
        throw new Error(data.error || 'Error fetching thread');
      }
    } catch (error) {
      console.error('Error fetching thread:', error);
      throw new Error('Error fetching thread');
    }
  },

  getHistory: async (userId) => {
    try {
      const response = await fetch(`${apiBaseUrl}/messages/${userId}`);
      const data = await response.json();
  
      if (response.ok) {
        const threads = {};
  
        data.forEach((message) => {
          const senderId = message.sender._id;
          const receiverId = message.receiver._id;
  
          // Create a unique thread identifier using both sender and receiver IDs
          const threadId = [senderId, receiverId].sort().join('-');
  
          if (!threads[threadId]) {
            threads[threadId] = {
              sender: message.sender,
              receiver: message.receiver,
              messages: [],
            };
          }
  
          threads[threadId].messages.push({
            _id: message._id,
            text: message.text,
            createdAt: message.createdAt,
            sender: message.sender,
            receiver: message.receiver,
            // Add other message properties if needed
          });
        });
  
        // Convert threads object to array and sort by the most recent message
        const sortedThreads = Object.values(threads).sort((a, b) => {
          const aDate = new Date(a.messages[a.messages.length - 1].createdAt);
          const bDate = new Date(b.messages[b.messages.length - 1].createdAt);
          return bDate - aDate;
        });
  
        return sortedThreads;
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
