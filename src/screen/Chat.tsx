import React from "react";
import { useState } from "react";
import { Text, View, StyleSheet, FlatList } from "react-native";
import { Button, TextInput } from 'react-native-paper';
import ChatBubble from "../components/ChatBubble";
import { callGpt } from "../model/Gpt";
/*
interface Message {
  sender: 'user' | 'bot';
  text: string;
}
const Chat: React.FC = () => {
  const [text, setText] = useState("");
  const [myText, setMyText] = useState("");
  const [aiText, setAiText] = useState("");
  const send = () => {
    console.log("보내기")
    setMyText(text);
    setText(""); 
  }
  const message : Message = {
    sender : "user",
    text : "my name is eunseo",
  }
  const message1 : Message = {
    sender : "bot",
    text : "hi eunseo",
  }
  return (
   <View style = {styles.container}>
    <View style = {styles.chat}>
    <ChatBubble message = {message}/>
    <ChatBubble message = {message1}/>
      
    </View>
    <View style = {styles.form}>
      <TextInput
        label="send message to cookie🐶"
        value={text}
        onChangeText={text => setText(text)}
        mode = "outlined"
        style = {styles.input}
      />
      <Button mode = "contained" onPress = {send} style = {styles.btn}>
        send
      </Button>
    </View>
   </View>
    
  );
};

const styles = StyleSheet.create({
  container : {
    width : "100%",
    height : "100%",
    paddingLeft : 16,
    paddingRight : 16,
    //backgroundColor : "red",
  },
  form : {
    flexDirection : "row",
    width : "100%",
    //backgroundColor : "blue",
    justifyContent : "space-between",
    paddingBottom : 10,
    paddingTop : 10,
  },
  input : {
    width : "75%",
  },
  btn : {
    width : "22%",
    justifyContent : "center",
    backgroundColor : "#FF6B6B",
  },
  chat : {
    flex : 1,
    //backgroundColor : "gray",
  }

});
export default Chat;
*/

interface Message {
  sender: 'user' | 'bot';
  text: string;
}



const originData =  [
  {
    sender : "user",
    text : "my name is eunseo",
  },
  {
    sender : "bot",
    text : "hi eunseo",
  }
]

const Chat: React.FC = () => {
  const [text, setText] = useState(""); //유저가 작성한 말
  const [data, setData] = useState(originData);
  const aiSend = async () => {
    const aiResponse = await callGpt(text);
    console.log("aiResponse ", aiResponse);
    setTimeout(()=> {
      const aiData = {sender : "bot", text : `${aiResponse}`};
      setData (prevData => {
        const updatedData = [...prevData, aiData];
        return updatedData;
      })
    }, 1000);
  }
  const userSend = () => {
    const userData = {sender : "user", text : `${text}`}
    setData(prevData => {
      const updatedData = [...prevData, userData];
      return updatedData;
    })
    setText("");
    aiSend();
  }
  const renderItem = ({ item }) => (
    <View style={[styles.bubble, item.sender === "user" ? styles.userBubble : styles.botBubble]}>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <View style = {styles.container }>
      <FlatList
        data = {data}
        renderItem = {renderItem}
      />
      <View style = {styles.form}>
        <TextInput
          label="send message to cookie🐶"
          value={text}
          onChangeText={text => setText(text)}
          mode = "outlined"
          style = {styles.input}
        />
        <Button mode = "contained" onPress = {userSend} style = {styles.btn}>
          send
        </Button>
      </View>
    </View>
      
    )
  }


const styles = StyleSheet.create({
  container : {
    width : "100%",
    height : "100%",
    padding : 16,
    //backgroundColor : "red",
  },
  form : {
    flexDirection : "row",
    width : "100%",
    //backgroundColor : "blue",
    justifyContent : "space-between",
    paddingBottom : 10,
    paddingTop : 10,
  },
  input : {
    width : "75%",
  },
  btn : {
    width : "22%",
    justifyContent : "center",
    backgroundColor : "#FF6B6B",
  },
  chat : {
    flex : 1,
    //backgroundColor : "gray",
  },
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
export default Chat;