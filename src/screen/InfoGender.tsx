import React from "react";
import { View, Text, Button } from "react-native";
import Tabbar from "./Tabbar";
const InfoGender: React.FC<any> = ({ navigation }) => {
  return (
    <View>
      <Text>성별</Text>
      <Button title="다음으로" onPress={() => navigation.navigate("Tabbar")} />
    </View>
  );
};
export default InfoGender;
