import React, { useEffect } from 'react';
import { getChatting } from '../../../../utils/storageUtils';
import Button from '../../../../components/button/Button';
import Calendar from '../../../../components/icons/svg/calendar';
import HeartIcon from '../../../../components/icons/svg/heart-icon';
import {
  AlertText,
  Container,
  ImageContainer,
  SignOutTitle,
  SignOutTitleContainer,
} from './DeactivateAlert.style';

import { SettingStackName } from '../../../../constants/Constants';
import Analytics from '../../../../utils/analytics';
import { View } from 'react-native';
import { css } from '@emotion/native';
import { rsHeight, rsWidth } from '../../../../utils/responsive-size';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cookieRepoInfo } from '../../../../apis/user-cookie-repo';

const DeactivateAlert: React.FC = ({ navigation }) => {
  //const chats = getChatting(); 왜 undefinec
  const insets = useSafeAreaInsets();
  const [totalChat, setTotalChat] = React.useState<number>(0);
  const [totalDays, setTotalDays] = React.useState<number>(0);

  //let chatCount = 10;
  //console.log('chats', chats);
  //if (chats) {
  //const chatArray = JSON.parse(chats);
  //chatCount = chatArray.length - 1;
  //console.log('⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️⭐️', chatCount);
  //}

  useEffect(() => {
    Analytics.watchWithdrawalDefenseScreen();
    cookieRepoInfo().then((data) => {
      setTotalChat((data?.totalChats ?? 0) * 2);
      setTotalDays(data?.totalDays ?? 0);
    });
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
            쿠키와 <SignOutTitle status="number">{totalDays + 1}일</SignOutTitle>동안{'\n'}
            <SignOutTitle status="number">{totalChat}번</SignOutTitle>의 추억을 쌓아왔어요.
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
            //background-color: pink;
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
