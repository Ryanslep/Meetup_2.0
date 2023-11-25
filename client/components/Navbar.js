// Navbar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavButton from './NavButton';
import { useAppContext } from './AppContext';
import BrowseIcon from '../assets/browse.png'
import DashboardIcon from '../assets/dashboard.png'
import MessageIcon from '../assets/message.png'

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Navbar = () => {
  const { loggedIn, user } = useAppContext(); // Use the context hook

  return (
    <View style={[styles.container, !loggedIn && styles.hidden]}>
      <NavButton title="Dashboard" to="Dashboard" user={user} icon={DashboardIcon} />
      <NavButton title="Events" to="Events" user={user} icon={BrowseIcon} />
      <NavButton title="Messages" to="Inbox" user={user} icon={MessageIcon} />
      {/* Add more NavButton components for additional screens */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'lightgray', // Customize the background color
    height: hp('12%'), // Customize the height
    width: '100%', // Take up the full width of the screen
    position: 'fixed', // or 'absolute' based on your layout needs
    bottom: 0, // Position at the bottom of the screen
    // zIndex: 999, // Adjust the zIndex to ensure it appears above other content
  },
  hidden: {
    display: 'none',
  },
});


export default Navbar;
