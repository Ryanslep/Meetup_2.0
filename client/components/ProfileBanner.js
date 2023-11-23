// ProfileBanner.js
import React from 'react';
import { ImageBackground, StyleSheet, Image, View, Text, Pressable } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import profilePlacholder from '../assets/profile-placeholder.jpg';
import { useAppContext } from './AppContext'; // Import the useAppContext hook
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileBanner = () => {
    const { user, setLoggedIn } = useAppContext(); // Use the useAppContext hook
    const navigation = useNavigation();

    const handleLogOut = async () => {
        // Handle logout using the context function
        await AsyncStorage.removeItem('@userId')
        setLoggedIn(false);
        navigation.navigate('Login');
    }

    const handlePreferences = () => {
        navigation.navigate('Preferences');
    }

    return (
        <ImageBackground source={require('../assets/profile-background.webp')} style={styles.banner}>
           
            <Pressable style={styles.button} onPress={() => navigation.navigate('Inbox')}>
                <Text style={styles.text}>Inbox</Text>
            </Pressable>
            
            <Pressable style={styles.button} onPress={handlePreferences}>
                <Text style={styles.text}>Preferences</Text>
            </Pressable>

            <Pressable style={styles.button} onPress={handleLogOut}>
                <Text style={styles.text}>Sign Out</Text>
            </Pressable>

            <View style={styles.profileContainer}>
                <Image style={styles.profilePlacholder} source={profilePlacholder} />
            </View>

            <Text style={styles.fullName}>{user.username}</Text>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    banner: {
        width: wp('100%'),
        minHeight: hp('33%'),
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: hp('4%'),
        marginBottom: hp('1%')
    },
    profileContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: 'hidden',
    },
    profilePlacholder: {
        width: '100%',
        height: '100%',
    },
    fullName: {
        marginTop: 25,
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
    },
    button: {
        backgroundColor: 'red', // Change the background color as needed
        padding: 10,
        borderRadius: 5,
    },
    text: {
        color: 'white', // Change the text color as needed
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileBanner;
