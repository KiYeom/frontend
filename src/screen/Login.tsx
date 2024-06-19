import { View, Text, StyleSheet } from "react-native";
import React from "react";

const Login: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>로그인 스크린</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
});
export default Login;
