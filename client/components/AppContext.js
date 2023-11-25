// AppContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [myRsvps, setMyRsvps] = useState(null);
  const [myEvents, setMyEvents] = useState(null);
  const [myInterested, setMyInterested] = useState(null);
  const [browseEvents, setBrowseEvents] = useState(null);
  const [user, setUser] = useState(null);

  const getCurrentUser = () => {
    return user;
  };

  const contextValue = {
    loggedIn,
    setLoggedIn,
    myRsvps,
    setMyRsvps,
    myEvents,
    setMyEvents,
    browseEvents,
    setBrowseEvents,
    user,
    setUser,
    getCurrentUser,
    myInterested,
    setMyInterested
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
