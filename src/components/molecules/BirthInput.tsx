import React from 'react';
import { View, Text } from 'react-native';
import { USER } from '../../constants/Constants';
const BirthInput: React.FC<any> = () => {
  return (
    <View>
      <Text>생년월일</Text>
      <Text>{USER.BIRTHDATE}</Text>
    </View>
  );
};
export default BirthInput;
