// FiltersComponent.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const Filters = ({ applyFilters }) => {
  // Implement your filter logic here

  return (
    <View style={{ width: wp('100%') }}>
      <Text>Filters:</Text>
      {/* Add your filter UI elements here */}
      <TouchableOpacity onPress={applyFilters}>
        <Text>Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Filters;
