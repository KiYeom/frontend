import React from "react";
import Login from "../screen/Login";
import { View, Text, StyleSheet, TouchableOpacity, Button } from "react-native";
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";
import { deleteDate } from "../../utils/storageUtils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GOOGLE_KEY } from "../../utils/storageUtils";
const LogoutButton: React.FC<any> = ({ navigation }) => {
  return (
    <TouchableOpacity>
      <Button title="Logout" />
    </TouchableOpacity>
  );
};
export default LogoutButton;
