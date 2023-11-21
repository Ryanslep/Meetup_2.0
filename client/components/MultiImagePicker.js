import React, { useState } from 'react';
import { View, Button, ScrollView, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const MultiImagePicker = ({ onImagesSelected }) => {
  const [images, setImages] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      multiple: true, // Enable multiple selection
    });

    if (!result.cancelled) {
      setImages([...images, ...result.assets]); // Concatenate new images with existing ones
      onImagesSelected([...images, ...result.assets]); // Notify parent component about the selected images
    }
  };

  return (
    <View>
      <Button title="Pick images from camera roll" onPress={pickImage} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {images.map((image, index) => (
          <Image key={index} source={{ uri: image.uri }} style={styles.image} />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
});

export default MultiImagePicker;
