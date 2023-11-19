import React, { useEffect } from 'react';
import Toast from 'react-native-root-toast';

const CustomAlert = ({ response }) => {
  useEffect(() => {
    if (response) {
      if (response.success) {
        showSuccessToast();
      } else {
        showErrorToast(response.error || 'An error occurred');
      }
    }
  }, [response]);

  const showSuccessToast = () => {
    Toast.show('Login Successful', {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      backgroundColor: 'green',
      textColor: 'white',
    });
  };

  const showErrorToast = (errorMessage) => {
    Toast.show(errorMessage, {
      duration: Toast.durations.LONG,
      position: Toast.positions.BOTTOM,
      backgroundColor: 'red',
      textColor: 'white',
    });
  };

  return null;
};

export default CustomAlert;
