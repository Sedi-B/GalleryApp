import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native";

function ViewPic() {
  const [imagesCollection, setImagesCollection] = useState([]); // For storing the databse info
  const [selectedImage, setSelectedImage] = useState(null); // For displaying the selected image
  const [selectedImageInfo, setSelectedImageInfo] = useState(null); // For displaying image info
  const [modalVisible, setModalVisible] = useState(false); // For modal functionality

  // Connecting to the database
  const db = SQLite.openDatabase("myPhotos.db");

  useEffect(() => {
    getData();
  }, [imagesCollection]);

  // Reading data from the SQLite database
  const getData = async () => {
    try {
      db.transaction((tx) => {
        tx.executeSql("SELECT * FROM myPhotos", [], (_, results) => {
          const images = results.rows._array;
          setImagesCollection(images);
          console.log("Image info", images);
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  // Deleting data from the SQLite database
  const deleImage = (id) => {
    db.transaction((tx) => {
      tx.executeSql("DELETE FROM myPhotos WHERE id = ?", [id], (_, result) => {
        if (result.rowsAffected > 0) {
          console.warn("Image deleted"); // Logs a massege if the image was deleted
        } else {
          console.log("Didn't Delete");
        }
        // console.warn('Image deleted'); // Logs a massege if the image was deleted
        // getData(); // Refresh the data after deleting
        setModalVisible(false);
      });
    });
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setSelectedImageInfo();
    setModalVisible(true);
  };

  const closeImage = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  const openImageInfo = (id) => {
    setSelectedImageInfo(id);
  };

  const imageInfor = () => {
    setSelectedImageInfo(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center" }}>
      {imagesCollection.length === 0 ? (
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          <Text>Images not found</Text>
        </View>
      ) : (
        <ScrollView style={{}}>
          {imagesCollection.map((item, index) => (
            <View
              key={index}
              style={{ justifyContent: "center", alignContent: "center" }}
            >
              <TouchableOpacity
                onPress={() => openImageModal(item.image_url)} // Open image when clicked
              >
                <Image source={{ uri: item.image_url }} style={styles.image} />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                  marginTop: -5,
                }}
              >
                <TouchableOpacity onPress={() => deleImage(item.id)}>
                  <MaterialIcons
                    style={{ margin: 15 }}
                    name="delete"
                    size={30}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openImageInfo(item.id)}>
                  <Ionicons
                    style={{ margin: 15 }}
                    name="information"
                    size={30}
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeImage}
      >
        <View style={{ flex: 1 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 80,
            }}
          >
            <TouchableOpacity onPress={closeImage}>
              <Ionicons name="close" style={styles.iconClose} size="30" />
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: selectedImage }}
            style={{ flex: 1, marginBottom: 70 }}
            resizeMode="contain"
          />
        </View>
      </Modal>
      <Modal
        animationType="slide"
        transparent={false}
        visible={!!selectedImageInfo}
        onRequestClose={imageInfor}
      >
        <View style={{ flex: 1 }}>
          {selectedImageInfo && (
            <View style={{ padding: 20 }}>
              <Text>Location {selectedImageInfo.location}</Text>
            </View>
          )}
          <TouchableOpacity onPress={imageInfor}>
            <Text style={{ alignSelf: "center", fontSize: 20 }}>
              <Ionicons style={{}} name="arrow-back" size={20} />
              Go back
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: 350,
    height: 340,
    margin: 10,
  },
  selectButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "blue",
    borderRadius: 5,
    marginLeft: 10,
  },
  selectedButton: {
    backgroundColor: "blue",
  },
  iconClose: {
    fontSize: 30,
  },
  iconInfo: {
    fontSize: 30,
  },
  iconDelete: {
    color: "black",
    fontSize: 30,
  },
});

export default ViewPic;
