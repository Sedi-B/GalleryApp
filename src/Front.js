import { StatusBar } from "expo-status-bar";
import {
  Button,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import pic from "../assets/frontCover.jpg";

export default function Front({ navigation }) {
  return (
    <View style={{ flex: 1, marginTop: -5 }}>
      <ImageBackground
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          margin: 10,
        }}
        source={pic}
      >
        <Pressable
          style={{
            backgroundColor: "gray",
            borderRadius: 5,
            padding: 10,
          }}
          onPress={() => navigation.navigate("SnapPic")}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>Open Camera</Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("ViewPic")}
          style={{
            color: "white",
            backgroundColor: "gray",
            borderRadius: 5,
            padding: 10,
          }}
        >
          <Text style={{ color: "white", fontWeight: "900" }}>
            Go to Gallery
          </Text>
        </Pressable>
      </ImageBackground>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
