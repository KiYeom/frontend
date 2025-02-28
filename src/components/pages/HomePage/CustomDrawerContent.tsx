import React from 'react';
import { useState } from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  UserSettingContainer,
  SubjectTextContainer,
  SubjectText,
} from '../SettingPage/Setting.style';
import MenuRow from '../../menu-row/menu-row';
import { Linking, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

const CustomDrawerContent = (props) => {
  //대화체를 관리하는 isCasualMode state
  const [isCasualMode, setIsCasualMode] = useState(true);
  return (
    <DrawerContentScrollView {...props}>
      <UserSettingContainer>
        <SubjectTextContainer>
          <SubjectText>대화방 관리</SubjectText>
        </SubjectTextContainer>
        <MenuRow
          text="반말 사용하기"
          showIcon={false}
          showToggle={true}
          isEnabled={isCasualMode}
          disabled={false}
          onPress={() => {
            setIsCasualMode(!isCasualMode);
          }}
        />
      </UserSettingContainer>
      <UserSettingContainer>
        <SubjectTextContainer>
          <SubjectText>서비스 관리</SubjectText>
        </SubjectTextContainer>
        <MenuRow
          text="버그 제보하기"
          onPress={async () => {
            //Analytics.clickTabSettingLogoutButton();
            if (Platform.OS === 'android') {
              await Linking.openURL('https://j2wk7.channel.io/home');
            } else {
              WebBrowser.openBrowserAsync('https://j2wk7.channel.io/home');
            }
          }}
        />
        <MenuRow
          text="제안 및 문의"
          onPress={async () => {
            await Linking.openURL('https://asked.kr/remind_cookie');
          }}
        />
        <MenuRow
          text="쿠키 팬아트 보내기"
          onPress={async () => {
            await Linking.openURL('https://asked.kr/remind_cookie');
          }}
        />
      </UserSettingContainer>
    </DrawerContentScrollView>
  );
};
export default CustomDrawerContent;
