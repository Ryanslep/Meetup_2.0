import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const TimePicker = ({ label, time, onChange }) => {
  const [show, setShow] = useState(false);
  const [selectedTime, setSelectedTime] = useState(time);

  const onPickerChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    onChange(currentTime);

    // Close the picker on Android after selecting a time
    if (Platform.OS === 'android') {
      setShow(false);
    }

    // Update the selected time
    setSelectedTime(currentTime);
  };

  const togglePicker = () => {
    setShow(!show);
  };

  return (
    <View>
      {Platform.OS === 'android' && (
        <TouchableOpacity onPress={togglePicker}>
          <Text>{selectedTime ? selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Time'}</Text>
        </TouchableOpacity>
      )}
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onPickerChange}
        />
      )}
      {Platform.OS === 'ios' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={onPickerChange}
        />
      )}
    </View>
  );
};

export default TimePicker;
