import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Image, View, Text, Pressable } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import profilePlacholder from '../assets/profile-placeholder.jpg';
import { useAppContext } from './AppContext';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

import userApi from '../api/userApi';

const ProfileBanner = () => {
    const [profileImage, setProfileImage] = useState(null);

    const { user, setLoggedIn } = useAppContext();
    const navigation = useNavigation();

    useEffect(() => {
        if (user.profilePic) {
            setProfileImage({ uri: user.profilePic })
        }
    }, [])

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
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });


        if (!result.cancelled) {
            const uri = result.assets[0].uri

            const manipulatedImage = await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 500 } }], // You can adjust the options as needed
                { base64: true }
            );

            const imageForDB = `data:image/jpeg;base64,${manipulatedImage.base64}`;
            const updateProfilePic = await userApi.uploadProfilePic(user._id, imageForDB);

            setProfileImage({ uri: imageForDB });
        }
    };

    return (
        <ImageBackground source={require('../assets/profile-background.webp')} style={styles.banner}>

            <View style={styles.userButtons}>
                <Pressable style={styles.button1} onPress={handlePreferences}>
                    <Text style={styles.text}>Preferences</Text>
                </Pressable>

                <Pressable style={styles.button2} onPress={handleLogOut}>
                    <Text style={styles.text}>Sign Out</Text>
                </Pressable>
            </View>

            <Pressable onPress={handlePickImage} style={styles.profileContainer}>
                {profileImage ? (
                    <Image style={styles.profileImage} source={profileImage} />
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
    userButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button1: {
        backgroundColor: '#aaa', // Change the background color as needed
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        width: '30%',
    },
    button2: {
        backgroundColor: '#aaa', // Change the background color as needed
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',

        width: '30%',
    },
   
    text: {
        color: 'white', // Change the text color as needed
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileBanner;