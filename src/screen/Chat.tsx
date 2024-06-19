import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Chat: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>chatting</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
});
export default Chat;
