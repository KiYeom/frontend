import React from "react";
import { useState } from "react";
import { View, Text, Image, StyleSheet, SafeAreaView } from "react-native";
import { Button, TextInput } from "react-native-paper";

const InfoAge: React.FC<any> = ({ navigation }) => {
  const [text, setText] = React.useState("");

  return (
    <View style={styles.container}>
      <View>
        <Image
          source={require("../../assets/cookieSplash.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.textArea}>
        <Text style={styles.txt}>당신의 생일을 축하해주고 싶어요!</Text>
        <Text style={styles.txt1}>생년월일을 알려주세요!</Text>
        {/* <Text style={styles.txt1}>쿠키는 당신의 이름을 알고 싶어요:)</Text> */}
      </View>

      <TextInput
        label="0000/00/00"
        value={text}
        onChangeText={(text) => setText(text)}
        maxLength={15}
        style={styles.input}
      />
      <View>
        <Button
          icon="check"
          mode="contained"
          onPress={() => navigation.navigate("InfoGender")}
          textColor="#000"
          style={styles.btn}
        >
          완료!
        </Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20, // 추가된 패딩으로 컨테이너의 여백 확보
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 20, // 이미지 상하 여백 추가
  },
  btn: {
    width: "30%",
    backgroundColor: "#58C3A5",
    color: "#000",
    marginTop: 20, // 버튼 상단 여백 추가
  },
  input: {
    width: "100%",
    marginVertical: 20, // 입력 상자 상하 여백 추가
  },
  textArea: {
    width: "100%",
    padding: 10, // 텍스트 영역의 내부 패딩 추가
    marginBottom: 20, // 텍스트 영역의 하단 여백 추가
  },
  txt: {
    fontSize: 20,
    textAlign: "center",
    color: "#000", // 텍스트 색상 설정
    marginBottom: 10, // 텍스트 간의 간격 추가
    fontFamily: "Pretendard-Medium",
  },
  txt1: {
    fontSize: 20,
    // fontWeight: "bold",
    textAlign: "center",
    color: "#000", // 텍스트 색상 설정
    marginBottom: 10, // 텍스트 간의 간격 추가
    // fontFamily: "Pretendard-Medium",
    fontFamily: "Pretendard-Medium",
  },
});
export default InfoAge;
