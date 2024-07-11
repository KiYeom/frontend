/*
import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { useEffect } from "react";
import { getData } from "../../utils/storageUtils";
import { GOOGLE_KEY } from "../../utils/storageUtils";

const SplashScreen: React.FC<any> = ({ navigation }) => {
  useEffect(() => {
    const checkUserStatus = async () => {
      const user = await getData(GOOGLE_KEY);
      if (user) {
        console.log(
          "기존회원 : 앱 들어오면 자동 로그인 -> 바로 tabbar 화면으로"
        );
        navigation.navigate("Tabbar");
      } else {
        navigation.navigate("Login");
      }
    };

    setTimeout(() => {
      checkUserStatus();
    }, 2000);
  }, []);
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/cookieSplash.png")}
        style={styles.image}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff", // app.json에서 설정한 배경색과 동일하게 설정
  },
  image: {
    width: 400,
    height: 400,
    resizeMode: "contain", // app.json에서 설정한 resizeMode와 동일하게 설정
  },
  spinner: {
    marginTop: 20,
  },
});
export default SplashScreen;
*/