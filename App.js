import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet } from "react-native";
import Front from "./src/Front";
import SnapPic from "./src/SnapPic";
import PreviewPictures from "./src/PreviewPictures";
import ViewPic from "./src/ViewPic";

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Front">
        <Stack.Screen
          name="Front"
          component={Front}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="SnapPic"
          component={SnapPic}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="PreviewPictures"
          component={PreviewPictures}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewPic"
          component={ViewPic}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
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
