import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, Text } from 'react-native';
import PagerView from 'react-native-pager-view';
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
      <PagerView
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(event) => setActiveIndex(event.nativeEvent.position)}
      >
        {pictures.map((image, index) => (
          <View key={index} style={styles.page}>
            <TouchableOpacity onPress={() => handleImagePress(index)}>
              <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
            </TouchableOpacity>
          </View>
        ))}
      </PagerView>

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
  pagerView: {
    height: hp('30%'), // Adjust the height as needed
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: hp('30%'), // Adjust the height as needed
    width: wp('80%'),
    borderRadius: 10,
    marginHorizontal: wp('2%'),
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
