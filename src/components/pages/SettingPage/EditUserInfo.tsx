import React from 'react';
import { Text, View } from 'react-native';
import NameInput from '../../molecules/NameInput';
import GenderInput from '../../molecules/GenderInput';
//설정 - 프로필 수정 화면
const EditUserInfo: React.FC = () => {
  return (
    <View style={{ flex: 1, paddingHorizontal: 24 }}>
      <NameInput />
      <GenderInput />
    </View>
  );
};
export default EditUserInfo;
