import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Chat from "./Chat";
import Setting from "./Setting";

const Home: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>홈 화면</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
});
export default Home;
