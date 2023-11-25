// App.js
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Platform, View } from 'react-native';
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

import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const Stack = createStackNavigator();

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Dashboard">
              {(props) => <ProfileScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="Events">
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
        </View>

        <Navbar />
        <StatusBar style="auto" />
      </NavigationContainer>
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    ...(Platform.OS === 'web' && { paddingBottom: hp('12%') }),
  },
});

export default App;
