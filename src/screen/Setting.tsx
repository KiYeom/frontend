import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React from "react";
import LogoutButton from "../components/LogoutButton";
interface UserInfo {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}
const Setting: React.FC<UserInfo> = ({ email, setEmail }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setting</Text>
      <Text>email : {email}</Text>
      <LogoutButton email={email} setEmail={setEmail} />
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
    color: "blue",
  },
});
export default Setting;
