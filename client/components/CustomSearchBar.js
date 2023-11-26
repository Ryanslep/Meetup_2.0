// SearchBarComponent.js
import React from 'react';
import { SearchBar } from 'react-native-elements';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const CustomSearchBar = ({ search, updateSearch }) => {
  return (
    <SearchBar
      placeholder="Search events..."
      onChangeText={updateSearch}
      value={search}
      containerStyle={{ width: wp('100%') }} // Make the search bar take up the entire width
    />
  );
};

export default CustomSearchBar;
