// DisplayTags.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const DisplayTags = ({ tags }) => { 

  return (
    <View style={styles.tagsContainer}>
      {tags.map((tag, index) => {
        // If the tag includes a color (e.g., "#49ers"), extract it
        const [name, color] = tag.split(',');

        return (
          <Text key={index} style={[styles.tag, { backgroundColor: color || '#e0e0e0' }]}>
            {name}
          </Text>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: wp('75%')
  },
  tag: {
    padding: 8,
    margin: 4,
    borderRadius: 8,
  },
});

export default DisplayTags;
