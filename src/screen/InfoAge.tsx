import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

const InfoAge: React.FC<any> = ({ navigation }) => {
  return (
    <View>
      <Text>당신의 생일을 축하해주고 싶어요! 생년월일을 알려주세요 :) </Text>
      <Image
        source={require("../../assets/cookieSplash.png")}
        style={styles.image}
        resizeMode="contain"
      />
      <Button onPress={() => navigation.navigate("InfoGender")}>완료</Button>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginTop: 100,
  },
});
export default InfoAge;
