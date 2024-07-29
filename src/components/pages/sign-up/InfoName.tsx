import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { useState, useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { storage } from '../../../utils/storageUtils';
import { SPLASH_PATH, USER } from '../../../constants/Constants';
import useNicknameState from '../../../store/nicknameState';
const InfoName: React.FC<any> = ({ navigation }) => {
  const [text, setText] = React.useState('');
  const { nickname, setNickname } = useNicknameState();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const saveInfoName = async () => {
    USER.NICKNAME = text;
    setNickname(text);
    navigation.navigate('InfoAge');
  };

  const handleText = (text: string) => {
    setText(text);
    setIsButtonDisabled(text.trim().length === 0);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView edges={['bottom', 'top']} style={styles.block}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView behavior={'padding'} style={styles.container}>
            <Image source={{ uri: SPLASH_PATH }} style={{ width: 200, height: 200 }} />
            <View style={styles.textArea}>
              <Text style={styles.txt}>만나서 반가워요, 멍!🐶</Text>
              <Text style={styles.txt}>쿠키가 당신을 부를 별명을 알려주세요</Text>
            </View>

            <View style={styles.formArea}>
              <TextInput
                label="별명 (15자 이내)"
                value={text}
                onChangeText={(text) => handleText(text)}
                maxLength={15}
                style={styles.input}
              />
              <Button
                icon="check"
                mode="contained"
                onPress={saveInfoName}
                textColor="#000"
                disabled={isButtonDisabled}
                style={styles.btn}>
                저장
              </Button>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: 200,
    height: 200,
  },
  btn: {
    width: '30%',
    backgroundColor: '#58C3A5',
    color: '#000',
    marginTop: 20, // 버튼 상단 여백 추가
  },
  input: {
    width: '100%',
  },
  textArea: {
    width: '100%',
    flex: 1,
    //backgroundColor: "blue",
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgArea: {
    flex: 1,
    //backgroundColor: "yellow",
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formArea: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //backgroundColor: "red",
  },
  txt: {
    fontSize: 20,
    textAlign: 'center',
    color: '#000', // 텍스트 색상 설정
    marginBottom: 10,
    fontFamily: 'Pretendard-Bold',
  },
  txt1: {
    fontSize: 20,
    // fontWeight: "bold",
    textAlign: 'center',
    color: '#000', // 텍스트 색상 설정
    marginBottom: 10,
    // fontFamily: "Pretendard-Medium",
    fontFamily: 'Pretendard-Medium',
  },
  block: {
    flex: 1,
    backgroundColor: 'white',
  },
  avoid: {
    flex: 1,
  },
});

export default InfoName;
