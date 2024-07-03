import React from "react";
import { Text, View, Image } from "react-native";
import { StyleSheet } from "react-native";
//import Icon from "react-native-vector-icons/MaterialIcons";
import LogoutButton from "./LogoutButton";
import DeleteAccoutButton from "./DeleteAccoutButton";

const UserSetting: React.FC<any> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View>
        <Text>알림설정</Text>
      </View>
      <View>
        <Text>문의하기</Text>
      </View>
      <View>
        <Text>개인정보 처리방침</Text>
      </View>
      <View>
        <LogoutButton navigation={navigation} />
      </View>
      <View>
        <DeleteAccoutButton navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 3,
    width: "100%",
    backgroundColor: "pink",
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 16,
    paddingRight: 16,
  },
  imgContainer: {
    width: 300,
    height: 300,
    backgroundColor: "yellow",
    justifyContent: "center",
    alignItems: "center",
  },
  userInfoContainer: {
    flex: 7,
  },
  image: {
    width: 200,
    height: 200,
  },
  text: {
    fontSize: 24,
    color: "#333",
  },
});

export default UserSetting;
