import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
interface LogoutButtonProps {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>; //setState 함수, string 타입
}
const LogoutButton: React.FC<LogoutButtonProps> = ({ email, setEmail }) => {
  return (
    <TouchableOpacity>
      <Button
        title="Logout"
        onPress={async () => {
          //Google객체를 사용하려면 반드시 configure 메서드를 호출해야 한다.
          GoogleSignin.configure({
            iosClientId:
              "94079762653-arcgeib4l0hbg6snh81cjimd9iuuoun3.apps.googleusercontent.com",
          });
          try {
            await GoogleSignin.signOut();
            setEmail("");
          } catch (error) {
            console.error(error);
          }
        }}
      />
    </TouchableOpacity>
  );
};
export default LogoutButton;
