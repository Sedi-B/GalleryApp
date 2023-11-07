import React, { useEffect, useRef, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView, StyleSheet, Text, View, Image } from "react-native";
import { Camera, CameraType } from "expo-camera";
import * as Location from "expo-location";
import * as Sharing from "expo-sharing";
import * as MediaLibrary from "expo-media-library";
import * as SQLite from "expo-sqlite";
import { useNavigation } from "@react-navigation/native";
import { Pressable } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

function SnapPic({ navigation }) {
  const [photo, setPhoto] = useState([]);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [hasMediaLibraryPermission, setHasMediaLibraryPermission] =
    useState(false);
  const [location, setLocation] = useState();
  const [type, setType] = useState(CameraType.back);

  let cameraRef = useRef("");

  const navigator = useNavigation();

  // Connect SQLite
  const db = SQLite.openDatabase("myPhotos.db");

  useEffect(() => {
    (async () => {
      const { status: cameraPermission } =
        await Camera.requestCameraPermissionsAsync();
      const { status: mediaLibraryPermission } =
        await MediaLibrary.requestPermissionsAsync();

      // GeoLocation
      const { status: locationPermission } =
        await Location.requestForegroundPermissionsAsync();

      setHasCameraPermission(cameraPermission === "granted");
      setHasMediaLibraryPermission(mediaLibraryPermission === "granted");

      //Location
      if (locationPermission === "granted") {
        const userLocation = await Location.getCurrentPositionAsync({});
        setLocation(userLocation);
      }
    })();

    createImageTable();
    setPhoto("");
  }, []);

  // Creating the table in SQLite
  const createImageTable = () => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS myPhotos (id INTEGER PRIMARY KEY AUTOINCREMENT, image_url TEXT)"
      );
    });
  };

  // TakePicture
  const takePic = async () => {
    if (!cameraRef.current) return;

    const options = {
      quality: 1,
      base64: true,
      exif: false,
    };

    try {
      let newPhoto = await cameraRef.current.takePictureAsync(options);

      if (location) {
        console.log(
          "User Location:",
          location.coords.latitude,
          location.coords.longitude
        );
      }

      setPhoto(newPhoto);
    } catch (err) {
      console.log(err);
    }
  };
  const flipCamera = () => {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  const closeCamera = () => {
    navigator.navigate("Front");
  };

  if (photo) {
    const sharePic = () => {
      Sharing(photo.uri).then(() => {
        setPhoto("");
      });
    };

    const savePhoto = async () => {
      try {
        const imageUrl = `${photo.uri}`;

        if (location) {
          const { latitude, longitude } = location.coords;

          console.log(
            "User Location:",
            location.coords.latitude,
            location.coords.longitude
          );

          db.transaction((tx) => {
            tx.executeSql(
              "insert into myPhotos (image_url) VALUES (?)",

              [imageUrl],
              (_, results) => {
                if (results.rowsAffected > 0) {
                  console.warn("Photo saved");
                } else {
                  console.warn("Photo not saved.");
                }
              }
            );
          });

          setPhoto("");
        }
      } catch (err) {
        console.log(err);
      }
    };

    return (
      <SafeAreaView
        style={{
          backgroundColor: "#C0C0C0",
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignContent: "center",
            marginVertical: "50%",
          }}
        >
          <View style={{ marginBottom: 30, borderRadius: 30 }}>
            <Image
              style={{ marginHorizontal: "25%", width: 200, height: 200 }}
              source={photo}
            />
          </View>
          <View
            style={{
              alignItems: "center",
              justifyContent: "space-between",
              alignSelf: "center",
              flexDirection: "row",
            }}
          >
            <Pressable
              style={{
                width: 150,
                backgroundColor: "gray",
                padding: 10,
                borderRadius: 15,
                margin: 5,
              }}
              onPress={savePhoto}
            >
              <Text
                style={{ fontSize: 15, fontWeight: "800", alignSelf: "center" }}
              >
                Save Picture
              </Text>
            </Pressable>
            <Pressable
              style={{
                width: 150,
                backgroundColor: "gray",
                padding: 10,
                borderRadius: 15,
                margin: 5,
              }}
              onPress={() => setPhoto("")}
            >
              <Text
                style={{ fontSize: 15, fontWeight: "800", alignSelf: "center" }}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (hasCameraPermission === null || hasMediaLibraryPermission === null) {
    return <Text>Requesting permissions...</Text>;
  } else if (!hasCameraPermission) {
    return <Text>Permission for camera not granted.Check settings.</Text>;
  }

  return (
    <Camera style={{ flex: 1 }} ref={cameraRef} type={type}>
      <View
        style={{
          flexDirection: "row",

          flex: 1,
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: 20,
        }}
      >
        <Pressable
          containerStyle={{
            width: 150,
            marginHorizontal: 15,
            margVertical: 10,
          }}
          onPress={flipCamera}
        >
          <Ionicons
            style={{ margin: 15 }}
            name="camera-reverse"
            size={60}
            color="white"
          />
        </Pressable>
        <Pressable
          containerStyle={{
            width: 150,
            marginHorizontal: 40,
            margVertical: 10,
          }}
          onPress={takePic}
        >
          <Ionicons
            style={{ margin: 15 }}
            name="camera"
            size={60}
            color="white"
          />
        </Pressable>

        <Pressable style={{}} onPress={() => navigation.navigate("ViewPic")}>
          <MaterialCommunityIcons
            style={{ margin: 15 }}
            name="view-gallery-outline"
            size={50}
            color="white"
          />
        </Pressable>
      </View>
    </Camera>
  );
}

const styles = StyleSheet.create({});

export default SnapPic;
