import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import LogoutButton from "../components/LogoutButton";
import DeleteAccoutButton from "../components/DeleteAccoutButton";
import { useNavigation } from "@react-navigation/native";
import { GOOGLE_KEY } from "../../utils/storageUtils";
import { deleteDate } from "../../utils/storageUtils";
interface UserInfo {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Setting: React.FC<any> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setting</Text>
      {/*<Text>email : {email}</Text>
      <LogoutButton email={email} setEmail={setEmail} />*/}

      <LogoutButton navigation={navigation} />
      <DeleteAccoutButton navigation={navigation} />
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
