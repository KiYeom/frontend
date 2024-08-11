import React from 'react';
import { Image } from 'react-native';
import { getChatting } from '../../../../../utils/storageUtils';
import {
  AlertText,
  Container,
  ImageContainer,
  SignOutTitle,
  SignOutTitleContainer,
} from './DeactivateAlert.style';
import Button from '../../../../button/button';
import HeartMessage from '../../../../../assets/images/heartmessage.svg';
import { SettingStackName } from '../../../../../constants/Constants';

const DeactivateAlert: React.FC = ({ navigation }) => {
  const chats = getChatting();
  //console.log(chats);
  let chatCount = 0;
  if (chats) {
    const chatArray = JSON.parse(chats);
    chatCount = chatArray.length;
  }

  //console.log('chats ========', chatCount);
  return (
    <Container>
      <SignOutTitleContainer>
        <SignOutTitle status="default">
          reMIND에서 쿠키와{'\n'}
          <SignOutTitle status="number">{chatCount}</SignOutTitle>
          번의 대화를 나누었어요!
        </SignOutTitle>
      </SignOutTitleContainer>
      <ImageContainer>
        <HeartMessage width={100} style={{ padding: 0, margin: 0 }} />
        <Image
          source={require('../../../../../assets/images/cal.jpg')}
          style={{ width: 150, height: 150, resizeMode: 'contain' }}
        />
      </ImageContainer>
      <AlertText>탈퇴 후, 모든 데이터는 복구가 불가능합니다.</AlertText>
      <Button
        title="탈퇴하기"
        disabled={false}
        primary={true}
        onPress={() => {
          console.log('탈퇴 버튼 누름');
          navigation.navigate(SettingStackName.DeactivateReason);
        }}
      />
    </Container>
  );
};
export default DeactivateAlert;
