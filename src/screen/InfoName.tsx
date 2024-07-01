import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useFonts } from "expo-font";
import { useState, useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";
import { useCallback } from "react";
import { storageData, getData } from "../../utils/storageUtils";
import { GOOGLE_KEY } from "../../utils/storageUtils";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";

const InfoName: React.FC<any> = ({ navigation }) => {
  const [text, setText] = React.useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const saveInfoName = async () => {
    const data = await getData(GOOGLE_KEY);
    data.nickname = text;
    storageData(GOOGLE_KEY, data);
    storageData("NICKNAME", text);
    navigation.navigate("InfoAge");
    const test = await getData(GOOGLE_KEY);
    //console.log("========test======== : ", test);
  };
  const handleText = (text: string) => {
    setText(text);
    setIsButtonDisabled(text.trim().length === 0);
  };
  /*        </KeyboardAvoidingView>
          <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}
        >
   */

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={["bottom", "top"]} style={styles.block}>
      <TouchableWithoutFeedback onPress = {Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior = {"padding"}
          style={styles.container}
        >
          <View style={styles.imgArea}>
            <Image
              source={require("../../assets/cookieSplash.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>
          <View style={styles.textArea}>
            <Text style={styles.txt}>만나서 반가워요, 멍!🐶</Text>
            <Text style={styles.txt1}>
              쿠키에게 당신의 이름을 알려주세요 :)
            </Text>
          </View>

          <View style={styles.formArea}>
            <TextInput
              label="이름 (15자 이내)"
              value={text}
              onChangeText={(text) => handleText(text)}
              maxLength={15}
              style={styles.input}
            />

            <Button
              icon="check"
              mode="contained"
              onPress={saveInfoName}
              textColor="#000"
              disabled={isButtonDisabled}
              style={styles.btn}
            >
              완료!
            </Button>
          </View>
        </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  btn: {
    width: "30%",
    backgroundColor: "#58C3A5",
    color: "#000",
    marginTop: 20, // 버튼 상단 여백 추가
  },
  input: {
    width: "100%",
  },
  textArea: {
    width: "100%",
    flex: 1,
    //backgroundColor: "blue",
    justifyContent: "center",
    alignItems: "center",
  },
  imgArea: {
    flex: 1,
    //backgroundColor: "yellow",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  formArea: {
    flex: 1,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
    //backgroundColor: "red",
  },
  txt: {
    fontSize: 20,
    textAlign: "center",
    color: "#000", // 텍스트 색상 설정
    marginBottom: 10,
    fontFamily: "Pretendard-Bold",
  },
  txt1: {
    fontSize: 20,
    // fontWeight: "bold",
    textAlign: "center",
    color: "#000", // 텍스트 색상 설정
    marginBottom: 10,
    // fontFamily: "Pretendard-Medium",
    fontFamily: "Pretendard-Medium",
  },
  block: {
    flex: 1,
    backgroundColor: "white",
  },
  avoid: {
    flex: 1,
  },
});

export default InfoName;
