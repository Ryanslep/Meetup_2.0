// Navbar.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import NavButton from './NavButton';
import { useAppContext } from './AppContext';

const Navbar = () => {
  const { loggedIn, user } = useAppContext(); // Use the context hook

  return (
    <View style={[styles.container, !loggedIn && styles.hidden]}>
      <NavButton title="Browse" to="Browse" user={user} />
      <NavButton title="Profile" to="Profile" user={user} />
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
    height: 60, // Customize the height
  },
  hidden: {
    opacity: 0, // Set opacity to 0 when not logged in
  },
});

export default Navbar;
