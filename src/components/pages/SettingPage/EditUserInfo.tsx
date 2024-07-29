import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import NameInput from '../../molecules/NameInput';
import GenderInput from '../../molecules/GenderInput';
import { Button } from 'react-native-paper';
import palette from '../../../assets/styles/theme';
//설정 - 프로필 수정 화면
const EditUserInfo: React.FC = () => {
  const editInfo = () => {
    console.log('유저 정보 수정하기 함수 실행');
  };
  return (
    <View style={styles.container}>
      <NameInput />
      <GenderInput />
      <Button
        style={{ backgroundColor: palette.primary[400] }}
        textColor="white"
        onPress={() => {
          console.log('저장 버튼이 눌림');
          console.log('유저 정보 수정하기');
        }}>
        저장
      </Button>
    </View>
  );
};
export default EditUserInfo;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
});
