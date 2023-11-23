// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppProvider } from './components/AppContext';

import RegisterScreen from './components/RegisterScreen';
import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen';
import Navbar from './components/Navbar';
import BrowseScreen from './components/BrowseScreen';
import EventFormScreen from './components/EventFormScreen';
import EventDetails from './components/EventDetails';
import Preferences from './components/Preferences';
import SendMessageScreen from './components/SendMessageScreen';
import Inbox from './components/Inbox';

const Stack = createStackNavigator();

const App = () => {
  return (
    <RootSiblingParent style={styles.container}>
      <AppProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Profile">
              {(props) => <ProfileScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="Browse">
              {(props) => <BrowseScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="Create Event">
              {(props) => <EventFormScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Event Details" component={EventDetails} />
            <Stack.Screen name="Inbox" component={Inbox} />
            <Stack.Screen name="Send Message" component={SendMessageScreen} />
            <Stack.Screen name="Preferences">
              {(props) => <Preferences {...props} />}
            </Stack.Screen>
          </Stack.Navigator>
          <Navbar />
          <StatusBar style="auto" />
        </NavigationContainer>
      </AppProvider>
    </RootSiblingParent>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
});

export default App;
