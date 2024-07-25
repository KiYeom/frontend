import React from 'react';
import { Text, View } from 'react-native';
import NameInput from '../../molecules/NameInput';
//설정 - 프로필 수정 화면
const EditUserInfo: React.FC = () => {
  return (
    <View style={{ flex: 1 }}>
      <NameInput />
    </View>
  );
};
export default EditUserInfo;
