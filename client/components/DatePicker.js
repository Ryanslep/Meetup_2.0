import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import FlexInput from './FlexInput';

const DatePicker = ({ label, date, onChange, setDate }) => {
  const [show, setShow] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);

  const onPickerChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    onChange(currentDate);

    // Close the picker on Android after selecting a date
    if (Platform.OS === 'android') {
      setShow(false);
    }

    // Update the selected date
    setSelectedDate(currentDate);
  };

  const togglePicker = () => {
    setShow(!show);
  };

  return (
    <View>
      {Platform.OS === 'android' && (
        <TouchableOpacity onPress={togglePicker}>
          <Text>{selectedDate ? selectedDate.toDateString() : 'Select Date'}</Text>
        </TouchableOpacity>
      )}
      {show && Platform.OS === 'android' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onPickerChange}
        />
      )}
      {Platform.OS === 'ios' && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onPickerChange}
        />
      )}
    </View>
  );
};

export default DatePicker;
