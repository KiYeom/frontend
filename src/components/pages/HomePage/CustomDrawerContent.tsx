import React from 'react';
import { useState, useEffect } from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  UserSettingContainer,
  SubjectTextContainer,
  SubjectText,
} from '../SettingPage/Setting.style';
import MenuRow from '../../menu-row/menu-row';
import { Linking, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as MailComposer from 'expo-mail-composer';
import { getUserNickname } from '../../../utils/storageUtils';
import Analytics from '../../../utils/analytics';

const sendMail = async () => {
  const options = {
    recipients: ['gwiyeomdungi37@gmail.com'],
    subject: `🐶쿠키 팬아트 제출🐶`,
    body: `안녕하세요, reMIND팀입니다. 쿠키에게 잊지 못 할 소중한 기억을 선물해주셔서 감사합니다 :) 쿠키의 팬아트와 함께 아래에 쿠키에게 하고 싶은 말을 남겨주세요. 팬아트 게시판 및 인스타그램에 24시간 내에 업로드가 됩니다!🐶🐾
    
    ✨닉네임 (수정 및 삭제 가능)✨ ${getUserNickname()}님
    💬전달 메세지💬 
    
    앞으로도 보호자님께서 쿠키와 행복한 시간을 보내실 수 있도록, 더욱 최선을 다 하는 reMIND팀이 되겠습니다.💚
    `.replace(/^ +/gm, ''),
  };
  const result = await MailComposer.composeAsync(options);
  if (result.status === 'sent') {
    console.log('Email sent');
  } else {
    console.log('Email not sent');
  }
};

const CustomDrawerContent = (props) => {
  useEffect(() => {
    console.log('사이드바 메뉴 열림');
    Analytics.watchOpenedSideMenuScreen();
  }, []);
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
            Analytics.clickChattingRoomSettingSwitch('반말 사용하기 (on/off)', !isCasualMode);
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
            Analytics.clickSideMenuBugReportButton();
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
            Analytics.clickSideMenuInquiryButton();
            await Linking.openURL('https://asked.kr/remind_cookie');
          }}
        />
        <MenuRow
          text="쿠키 팬아트 보내기"
          onPress={async () => {
            Analytics.clickSideMenuCookieFanArtButton();
            //sendMail();
            if (Platform.OS === 'android') {
              await Linking.openURL('https://3kpe9.channel.io/home');
            } else {
              WebBrowser.openBrowserAsync('https://3kpe9.channel.io/home');
            }
          }}
        />
      </UserSettingContainer>
    </DrawerContentScrollView>
  );
};
export default CustomDrawerContent;
