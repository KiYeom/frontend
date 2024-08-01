import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '../../button/button';
import CustomTextArea from '../../atoms/CustomTextArea';
import DeactivateReasonCheckBoxs from '../../molecules/DeactivateReasonCheckBoxs';
import Calender from '../../../assets/images/calendar.svg';
import { Alert } from 'react-native';
import { USER } from '../../../constants/Constants';
import { SignOutTitle, SignOutTitleContainer, Container } from './DeactivateAlert.style';
import { storage } from '../../../utils/storageUtils';
import { NICKNAME } from '../../../constants/Constants';
import { CTAContainer } from '../sign-up/input-name/input-name.styles';
import { CheckboxContainer, SignOutButtonContaier } from './DeactivateReason.style';
import TextArea from '../../textarea/TextArea';
import { useState } from 'react';
let deactivateReason = '';
const DeactivateReason: React.FC = ({ route }) => {
  const [text, setText] = useState('');
  const onChangeText = () => {
    setText(text);
  };
  const { deactivateRequest } = route.params;
  return (
    <Container>
      <SignOutTitleContainer>
        <SignOutTitle status="default">
          {storage.getString(NICKNAME)}님,{'\n'}떠나시는 이유를 알려주세요
        </SignOutTitle>
      </SignOutTitleContainer>
      <CheckboxContainer>
        <DeactivateReasonCheckBoxs />
        <TextArea
          placeholder="떠나시는 이유를 작성해주세요"
          value={text}
          onChange={(text) => {
            setText(text);
          }}
        />
      </CheckboxContainer>
      <Button
        title="탈퇴하기"
        disabled={false}
        primary={true}
        onPress={() => {
          console.log('탈퇴 버튼 누름');
          deactivateReason = text;
          console.log('떠나는 이유 서술형 ', deactivateReason);
          Alert.alert(
            '정말 탈퇴하시겠어요?', // 첫번째 text: 타이틀 큰 제목
            '탈퇴 버튼 선택 시, 계정은 삭제되며 복구되지 않습니다', // 두번째 text: 작은 제목
            [
              { text: '취소', onPress: () => console.log('탈퇴 취소함') },
              {
                text: '탈퇴', // 버튼 제목
                onPress: () => deactivateRequest(),
              },
            ],
            { cancelable: false }, //alert 밖에 눌렀을 때 alert 안 없어지도록
          );
          //deactivateRequest();
        }}
      />
    </Container>
  );
};
export default DeactivateReason;
const styles = StyleSheet.create({
  checkbox: {
    marginBottom: 20,
  },
  row: {
    alignItems: 'center',
  },
  txt: {
    fontSize: 28,
    marginTop: 40,
  },
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    flex: 1,
  },
});
