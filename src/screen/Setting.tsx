import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import React from "react";
import LogoutButton from "../components/LogoutButton";
import { useNavigation } from "@react-navigation/native";
import { GOOGLE_KEY } from "../../utils/storageUtils";
import { deleteDate } from "../../utils/storageUtils";
interface UserInfo {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
}
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Setting: React.FC<any> = ({ navigation }) => {
  const handleLogout = async () => {
    //Google객체를 사용하려면 반드시 configure 메서드를 호출해야 한다.
    GoogleSignin.configure({
      iosClientId:
        "94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3.apps.googleusercontent.com",
    });
    try {
      await GoogleSignin.signOut(); //계정 로그아웃
      //deleteDate(GOOGLE_KEY);
      console.log("눌림");
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setting</Text>
      {/*<Text>email : {email}</Text>
      <LogoutButton email={email} setEmail={setEmail} />*/}
      <Button title="Logout~~" onPress={handleLogout} />
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
