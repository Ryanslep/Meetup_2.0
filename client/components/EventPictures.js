import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import Swiper from 'react-native-web-swiper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const EventPictures = ({ pictures }) => {
  if (!pictures || pictures.length === 0) {
    return null; // Render nothing if there are no pictures
  }

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleImagePress = (index) => {
    setSelectedImage(pictures[index]);
    setModalVisible(true);
    setActiveIndex(index);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedImage(null);
  };

  return (
    <View>
      <View style={{ height: hp('30%') }}>
        <Swiper
          // style={styles.swiper}
          loop={false}
          index={activeIndex}
          onIndexChanged={(index) => setActiveIndex(index)}
        >
          {pictures.map((image, index) => (
            <TouchableOpacity key={index} onPress={() => handleImagePress(index)}>
              <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </Swiper>
      </View>
      {/* Display current image number tracker */}
      <View style={styles.imageTracker}>
        <Text style={styles.imageTrackerText}>{`${activeIndex + 1}/${pictures.length}`}</Text>
      </View>

      {/* Modal for displaying selected image */}
      <Modal visible={modalVisible} transparent={true} onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
          <Image style={styles.modalImage} source={{ uri: selectedImage }} resizeMode="contain" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  swiper: {
    height: hp('30%'), // Adjust the height as needed
  },
  image: {
    height: hp('30%'), // Adjust the height to match the Swiper height
    width: wp('100%'), // Adjust the width to take the full width of the Swiper
    borderRadius: 10,
  },
  imageTracker: {
    position: 'absolute',
    top: hp('2%'),
    alignSelf: 'center',
  },
  imageTrackerText: {
    color: 'white',
    fontSize: wp('4%'),
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: hp('5%'), // Adjusted the top position
    right: wp('2%'),
    zIndex: 1,
  },
  closeButtonText: {
    color: 'white',
    fontSize: wp('4%'),
  },
  modalImage: {
    width: wp('100%'),
    height: hp('80%'),
  },
});

export default EventPictures;
