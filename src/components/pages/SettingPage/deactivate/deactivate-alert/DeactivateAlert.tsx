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
import { View } from 'react-native';
import { css } from '@emotion/native';
import { rsHeight, rsWidth } from '../../../../../utils/responsive-size';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DeactivateAlert: React.FC = ({ navigation }) => {
  const chats = getChatting();
  const insets = useSafeAreaInsets();

  let chatCount = 0;
  if (chats) {
    const chatArray = JSON.parse(chats);
    chatCount = chatArray.length - 1;
  }

  useEffect(() => {
    Analytics.watchWithdrawalDefenseScreen();
  }, []);

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={{
        flexGrow: 1,
        marginBottom: insets.bottom,
      }}>
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

        <View
          style={css`
            display: flex;
            justify-content: center;
            padding: 0 0 ${rsWidth * 24 + 'px'} 0;
            gap: ${rsHeight * 12 + 'px'};
          `}>
          <AlertText>탈퇴 후, 모든 데이터는 복구가 불가능합니다.</AlertText>

          <Button
            title="저장"
            disabled={false}
            primary={true}
            onPress={() => {
              Analytics.clickUserInfoEditInfoButton();
              navigation.navigate(SettingStackName.DeactivateReason);
            }}
          />
        </View>
      </Container>
    </KeyboardAwareScrollView>
  );
};
export default DeactivateAlert;
