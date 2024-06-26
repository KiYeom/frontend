import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { TextInput, Button } from "react-native-paper";

const InfoName: React.FC<any> = ({ navigation }) => {
  const [text, setText] = React.useState("");
  return (
    <View>
      <View>
        <Text>만나서 반가워요. 쿠키에게 당신의 이름을 알려주세요</Text>
      </View>
      <View>
        <TextInput
          value={text}
          onChangeText={(text) => setText(text)}
          maxLength={15}
        />
      </View>
      <View>
        <Image
          source={require("../../assets/cookieSplash.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      <View>
        <Button
          icon="camera"
          mode="contained"
          onPress={() => navigation.navigate("InfoAge")}
        >
          완료!
        </Button>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  image: {
    width: 200,
    height: 200,
  },
});

export default InfoName;
