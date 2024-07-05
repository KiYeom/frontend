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

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

const ChatBubble: React.FC<{message : Message}> = ({message}) => {
  const isUser = message.sender === 'user';
  return (
    <View style={[styles.bubble, isUser ? styles.userBubble : styles.botBubble]}>
      <Text style={styles.text}>{message.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  botBubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  text: {
    color: 'black',
  },
});


export default ChatBubble;
