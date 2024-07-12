import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Button } from "react-native-paper";
import GenderButton from "../components/GenderButton";
import Tabbar from "./Tabbar";
import { GOOGLE_KEY } from "../../utils/storageUtils";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { storage } from "../../utils/storageUtils";
import { USER, MALE, FEMALE, REFRESHTOKEN, ACCESSTOKEN } from "../constants/Constants";
import useIsSignInState from "../store/signInStatus";
//console.log(axios.isCancel("something"));

const InfoGender: React.FC<any> = ({ navigation }) => {
  const [selectedGender, setSelectedGender] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const {isSignIn, setIsSignIn} = useIsSignInState();
  const isMale = selectedGender === "male";
  const isFemale = selectedGender === "female";
  

  useEffect(() => {
    setIsButtonDisabled(selectedGender === "");
    
  }, [selectedGender]);

  const saveInfoGender = async () => {
    if (isMale) {
      USER.GENDER = MALE;
    } else if (isFemale) {
      USER.GENDER = FEMALE;
    }
    await setIsButtonDisabled(false);
    //console.log("회원가입에 사용하는 데이터", DATA);
    console.log("======= ", isButtonDisabled);

    axios //회원가입하기
      .post("http://34.125.112.144:8000/v1/auth/signup", {
        email : USER.EMAIL,
        providerName : USER.PROVIDERNAME,
        providerCode : USER.PROVIDERCODE,
        nickname : USER.NICKNAME,
        birthdate : USER.BIRTHDATE,
        gender : USER.GENDER,
        deviceId : USER.DEVICEID,
        appVersion : USER.APPVERSION,
        deviceOs : USER.DEVICEOS,
      })
      .then(function (response) {
        console.log("회원가입 성공", response);
        storage.set(ACCESSTOKEN, response.data.data.accessToken);
        storage.set(REFRESHTOKEN, response.data.data.refreshToken);
        console.log("회원가입 refreshtoken : ", response.data.data.refreshToken);
        setIsSignIn(true); //tabbar로 이동
        console.log("======= ", isButtonDisabled);
        //navigation.navigate("Tabbar");
      })
      .catch(function (error) {
        //오류 발생 시 실행
        console.log("InfoGender error(data): ", error.response.data);
        console.log("InfoGender error(stats)", error.response.status);
        console.log("InfoGender error(headers)", error.response.headers);
        console.log("======= ", isButtonDisabled);
      });
  };
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
        <GenderButton
          selectedGender={selectedGender}
          setSelectedGender={setSelectedGender}
        />
      </View>
      <View>
        <Button
          icon="check"
          mode="contained"
          onPress={saveInfoGender}
          textColor="#000"
          style={styles.btn}
          disabled={isButtonDisabled} // disabled 상태로 ���키 선택시 버�� 비��성화
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
