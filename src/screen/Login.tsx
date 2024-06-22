import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, View, Text } from "react-native";
import { useEffect } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { statusCodes } from "@react-native-google-signin/google-signin";

// 로그인 버튼 누르면 웹 브라우저가 열리고, 구글 로그인 페이지로 이동함.
WebBrowser.maybeCompleteAuthSession();
const Login: React.FC = () => {
  return (
    <View>
      <Button
        title="에"
        onPress={async () => {
          GoogleSignin.configure({
            iosClientId:
              "94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3.apps.googleusercontent.com",
          });

          try {
            await GoogleSignin.hasPlayServices();
            const userInfo = await GoogleSignin.signIn();
            console.log(userInfo);
          } catch (error) {
            console.log(error);
          }
        }}
      />
    </View>
  );
};

export default Login;
