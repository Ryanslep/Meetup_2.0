// ProfileBanner.js
import React, { useState } from 'react';
import { ImageBackground, StyleSheet, Image, View, Text, Pressable } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import profilePlacholder from '../assets/profile-placeholder.jpg';
import { useAppContext } from './AppContext'; // Import the useAppContext hook
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import userApi from '../api/userApi';

const ProfileBanner = () => {
    const [profileImage, setProfileImage] = useState(null);

    const { user, setLoggedIn } = useAppContext(); // Use the useAppContext hook
    const navigation = useNavigation();

    const handleLogOut = async () => {
        // Handle logout using the context function
        await AsyncStorage.removeItem('@userId');
        setLoggedIn(false);
        navigation.navigate('Login');
    }

    const handlePreferences = () => {
        navigation.navigate('Preferences');
    }

    const handlePickImage = async () => {
        console.log('Picking Image')
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });


        if (!result.cancelled) {
            console.log('result wasn\'t canceled');
            console.log(result.assets[0].uri)
            setProfileImage(result.assets[0].uri)
            // // Extract base64 data from the result
            // const base64Data = result.assets;

            // const updateProfilePic = await userApi.uploadProfilePic(user._id, base64Data);
            // console.log(updateProfilePic)
        }
    };

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

            <Pressable onPress={handlePickImage} style={styles.profileContainer}>
                {profileImage ? (
                    <Image style={styles.profileImage} source={{ uri: profileImage }} />
                ) : (
                    <Image style={styles.profilePlacholder} source={profilePlacholder} />
                )}
            </Pressable>


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
        width: 150,
        height: 150,
    },
    profileImage: {
        width: 150,
        height: 150,
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
