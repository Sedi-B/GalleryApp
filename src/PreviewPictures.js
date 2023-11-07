import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import ViewPic from "./ViewPic";

function PreviewPictures() {
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <ViewPic />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    Flex: 1,
    justifyContent: "center",
    alignItems: "ceneter",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "ceneter",
  },
});

export default PreviewPictures;
