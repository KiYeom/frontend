import React from "react";
import { Text, View, Image } from "react-native";
import { StyleSheet } from "react-native";
//import Icon from "react-native-vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import { USER } from "../constants/Constants";
import { Button } from "react-native-paper";
import { IconButton, MD3Colors } from 'react-native-paper';
import NameModal from "./NameModal";
import { Modal, Portal, PaperProvider } from 'react-native-paper';
/*

const chatBubble: React.FC<string> = ({text}) => {
  return ();
};

const styles = StyleSheet.create({
});

export default chatBubble;
*/