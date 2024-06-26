import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import Chat from "./Chat";
import Setting from "./Setting";

const Home: React.FC = () => {
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.text}>홈 화면</Text>
      </View>
      <View>
        <Image
          source={require("../../assets/cookieSplash.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FCEC",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "#333",
    backgroundColor: "#58C3A5",
  },
  image: {
    width: 200,
    height: 200,
  },
});
export default Home;
