import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";

const Login: React.FC = () => {
  const onClick = () => {
    console.log("click");
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>로그인 스크린</Text>
      <Pressable onPress={onClick} style={styles.btn}>
        <Text style={styles.text}>구글 로그인 버튼</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "gray",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
  btn: {
    backgroundColor: "red",
    width: 100,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
  },
});
export default Login;
