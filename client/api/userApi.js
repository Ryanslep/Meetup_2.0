import { apiBaseUrl } from '../utils/apiUtils';

const userApi = {
  getUserInfo: async (userId) => {
    const response = await fetch(`${apiBaseUrl}/user/fetch/${userId}`);
    const userInfo = await response.json();
    return userInfo; // Add this line to return userInfo
  },
  updateProfile: async (userId, updatedProfileData) => {
    try {
      // Make a request to the API endpoint responsible for updating user profiles
      const response = await fetch(`${apiBaseUrl}/user/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // Add any other headers as needed
        },
        body: JSON.stringify(updatedProfileData),
      });
  
      // Check if the request was successful (status code 2xx)
      if (response.ok) {
        // Parse the response JSON and return it
        return await response.json();
      } else {
        // If the request was not successful, throw an error with the status text
        const errorText = await response.text();
        throw new Error(`Error updating profile: ${errorText}`);
      }
    } catch (error) {
      // Handle any errors that occurred during the request
      console.error('Error updating profile:', error);
      throw error; // Rethrow the error for the component to handle
    }
  },
  
  getUserByUsername: async (username) => {
    const response = await fetch(`${apiBaseUrl}/user/fetchUsername/${username}`);
    const userInfo = await response.json();
    return userInfo; // Add this line to return userInfo
  },
  
  blockUser: async (userId, blockedUserId) => {

      const response = await fetch(`${apiBaseUrl}/user/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, blockedUserId }),
      });
  
      const data = await response.json();

      return data
  }, 
  
  register: async (username, email, password, fullName) => {
    const response = await fetch(`${apiBaseUrl}/user/register/${username}/${email}/${password}/${fullName}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const newUser = await response.json();
    return newUser;
  },
  login: async (username, password) => {
    const response = await fetch(`${apiBaseUrl}/user/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    });

    const loggedInUser = await response.json();
    return loggedInUser;
  },
  sendMessage: async (senderId, receiverId, content) => {
    const response = await fetch(`${apiBaseUrl}/user/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId,
        receiverId,
        content
      }),
    });
  },
  getMyEvents: async (userId) => {
    const response = await fetch(`${apiBaseUrl}/user/myEvents/${userId}`);
    const myEvents = await response.json();
    return myEvents;
  },
  getMyRsvps: async (userId) => {
    const response = await fetch(`${apiBaseUrl}/user/myRsvps/${userId}`);
    const myRsvps = await response.json();
    return myRsvps;
  },
  getMyInterested: async (userId) => {
    const response = await fetch(`${apiBaseUrl}/user/myInterested/${userId}`);
    const myInterested = await response.json();
    return myInterested;
  },
  getPreferences: async (userId) => {
    const response = await fetch(`${apiBaseUrl}/user/preferences/${userId}`);
    const myPreferences = await response.json();
    return myPreferences;
  },
  savePreferences: async (userId, preferences) => {
    const response = await fetch(`${apiBaseUrl}/user/preferences/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const error = await response.json();
      throw new Error(error.message);
    }
  },
  handleBlockConfirmation: async (userId, blockedUserId) => {
    try {

      const response = await fetch(`${apiBaseUrl}/user/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          blockedUserId: blockedUserId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        return data; // Return the data if the request was successful
      } else {
        throw new Error(data.error || 'Error blocking user'); // Throw an error if the request was not successful
      }
    } catch (error) {
      console.error('Error in handleBlockConfirmation:', error);
      throw new Error('Error blocking user');
    }
  },
  uploadProfilePic: async (userId, file) => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({userId: userId, file: file}),
      };
  
      const response = await fetch(`${apiBaseUrl}/user/upload-profile-pic`, requestOptions);
  
      const data = await response.json();
  
      if (response.ok) {
        // You can perform additional actions based on the response, such as updating the UI
      } else {
        console.error('Error uploading profile picture:', data.error);
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error.message);
    }
  },
}

export default userApi;