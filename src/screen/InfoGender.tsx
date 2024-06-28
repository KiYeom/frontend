import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import GenderButton from "../components/GenderButton";
import Tabbar from "./Tabbar";
import { storageData } from "../../utils/storageUtils";
import { GOOGLE_KEY } from "../../utils/storageUtils";
import { getData } from "../../utils/storageUtils";

const InfoGender: React.FC<any> = ({ navigation }) => {
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
        <Text style={styles.txt}>쿠키는 당신을 더 잘 이해하고 싶어요</Text>
        <Text style={styles.txt1}>성별을 알려주세요!</Text>
        {/* <Text style={styles.txt1}>쿠키는 당신의 이름을 알고 싶어요:)</Text> */}
      </View>
      <View style={styles.genderSelectArea}>
        <GenderButton />
      </View>
      <View>
        <Button
          icon="check"
          mode="contained"
          onPress={() => navigation.navigate("Tabbar")}
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
  genderSelectArea: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
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
export default InfoGender;
