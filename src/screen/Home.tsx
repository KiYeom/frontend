import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Image, Linking, Button } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import StartButton from "../components/StartButton";
import Chat from "./Chat";
import Setting from "./Setting";
import { useEffect } from "react";
import useNoticeState from "../store/notice";
import {PaperProvider, Portal, Modal} from "react-native-paper";

interface Option {
  link : string;
  text : string;
}

const Home: React.FC<any> = ({ navigation }) => {
  const {notice, setNotice} = useNoticeState();
  //useEffect를 사용하면 동시에 그려지는 것 같다.
  /*
  useEffect(()=> {
    console.log("useEffect!");
    if (notice != null) {
      console.log("notice 전체 : ", notice);
      console.log("Notice title : ", notice.title);
      console.log("Notice content : ", notice.content);
      console.log("버튼의 개수 : ", notice.options.length);
      console.log("options : ", notice.options[0]);
      console.log("options detail : ", notice.options[0], notice.options[0].text, notice.options[0].link);
      showModal();
    }
    else {
      console.log("없습니다");
    }
  }, [])*/
  console.log("---------home notice---------", notice);
  const [visible, setVisible] = React.useState(false);
  const title = notice ? notice.title : null;
  const content = notice? notice.content : null;
  const btns = notice? notice.options : null;

  /*
  const showModal = () => {
    setVisible(true);
    console.log("실행함")
  };
  const hideModal = () => setVisible(false);
  const containerStyle = {backgroundColor: 'white', padding: 20};
  useEffect(()=> {
    showModal();
  }, [notice])*/
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.txt1}>🐾오늘도 와줘서 고마워 멍! ૮ ・ﻌ・ა</Text>
      </View>
      <View style={styles.center}>
        <Image
          source={require("../../assets/cookieSplash.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View style={styles.footer}>
        <StartButton navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginTop: 50, // 상단에 약간의 여백 추가
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    alignItems: "center",
    marginBottom: 30, // 하단에 약간의 여백 추가
  },
  txt1: {
    fontSize: 24,
    fontFamily: "Pretendard-SemiBold",
  },
  txt2: {
    fontSize: 24,
  },
  image: {
    width: 200,
    height: 200,
  },
});
export default Home;
