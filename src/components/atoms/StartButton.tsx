import React from 'react';
import { Text, View, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Button } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const StartButton: React.FC<any> = ({ navigation }) => {
  const [isPressed, setIsPressed] = useState(false);
  const onPress = () => {
    setIsPressed(!isPressed);
    console.log('버튼 누름');
    navigation.navigate('HomeStackNavigator', { screen: 'Chat' });
  };
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.btn} onPress={onPress}>
      <Text style={styles.txt}>쿠키와 대화할까?🐶</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: '100%',
    backgroundColor: '#3B506B',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  txt: {
    color: 'white',
    fontSize: 17,
    fontFamily: 'Pretend-Bold',
    textAlign: 'center',
  },
});

export default StartButton;
