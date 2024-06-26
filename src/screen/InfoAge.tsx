import React from "react";
import { View, Text } from "react-native";
import { Button } from "react-native";

const InfoAge: React.FC<any> = ({ navigation }) => {
  return (
    <View>
      <Text>나이</Text>
      <Button
        title="다음으로"
        onPress={() => navigation.navigate("InfoGender")}
      />
    </View>
  );
};
export default InfoAge;
