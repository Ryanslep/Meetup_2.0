import React, { useEffect } from 'react';
import Toast from 'react-native-root-toast';

const CustomAlert = ({ message, success }) => {
  useEffect(() => {
    const color = success ? 'green' : 'red';

    // Show the toast with the provided message and styling
    const toast = Toast.show(message, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM, // Adjust the position here
      backgroundColor: color,
      textColor: 'white',
      shadow: true,
      animation: true,
      hideOnPress: true,
      delay: 0,
    });

    // Automatically hide the toast after a duration
    // setTimeout(() => {
    //   Toast.hide(toast);
    // }, Toast.durations.LONG);
  }, [message, success]);

  return null;
};

export default CustomAlert;
