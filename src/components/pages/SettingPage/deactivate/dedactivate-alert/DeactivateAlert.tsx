import React, { useEffect } from 'react';
import { getChatting } from '../../../../../utils/storageUtils';
import Button from '../../../../button/button';
import Calendar from '../../../../icons/svg/calendar';
import HeartIcon from '../../../../icons/svg/heart-icon';
import {
  AlertText,
  Container,
  ImageContainer,
  SignOutTitle,
  SignOutTitleContainer,
} from './DeactivateAlert.style';

import { SettingStackName } from '../../../../../constants/Constants';
import Analytics from '../../../../../utils/analytics';

const DeactivateAlert: React.FC = ({ navigation }) => {
  const chats = getChatting();
  //console.log(chats);
  let chatCount = 0;
  if (chats) {
    const chatArray = JSON.parse(chats);
    chatCount = chatArray.length - 1;
  }

  useEffect(() => {
    Analytics.watchWithdrawalDefenseScreen();
  }, []);

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
        <HeartIcon />
        <Calendar width={150} height={150} />
      </ImageContainer>

      <AlertText>탈퇴 후, 모든 데이터는 복구가 불가능합니다.</AlertText>
      <Button
        title="탈퇴하기"
        disabled={false}
        primary={true}
        onPress={() => {
          Analytics.clickWithdrawalButton();
          navigation.navigate(SettingStackName.DeactivateReason);
        }}
      />
    </Container>
  );
};
export default DeactivateAlert;
