import React from 'react';
import { useState, useEffect } from 'react';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import {
  UserSettingContainer,
  SubjectTextContainer,
  SubjectText,
} from '../SettingPage/Setting.style';
import MenuRow from '../../components/menu-row/menu-row';
import { Linking, Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as MailComposer from 'expo-mail-composer';
import { getUserNickname } from '../../utils/storageUtils';
import Analytics from '../../utils/analytics';
import { switchChatTone, getUserInfo } from '../../apis/setting';
import { getRiskScore } from '../../apis/riskscore';

const CustomDrawerContent = (props: any) => {
  //대화체를 관리하는 isCasualMode state
  const [isInFormalMode, setIsInformalMode] = useState(true);
  //위험 점수와 상태를 관리하는 state
  const [riskScore, setRiskScore] = React.useState<number>(0);
  const [riskStatus, setRiskStatus] = React.useState<'safe' | 'danger' | 'danger-opened'>('danger');

  /*
  사이드바를 오픈했을 때 실행되는 useEffect 훅
  1. 사이드바가 오픈되면 유저의 대화 문체 정보를 서버에서 가져와서 isFormalMode state를 업데이트한다.
   */
  useEffect(() => {
    //console.log('사이드바 메뉴 열림');
    Analytics.watchOpenedSideMenuScreen();
    getUserInfo()
      .then((res) => {
        //console.log('😀😀😀😀😀😀😀😀v', res);
        if (res) {
          console.log('then', res);
          setIsInformalMode(res.isInFormal);
        } else {
          console.log('????');
        }
      })
      .catch((error) => {
        console.log('catch');
      });
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      {riskStatus !== 'safe' && (
        <UserSettingContainer>
          <SubjectTextContainer>
            <SubjectText>언제나 곁에서 힘이 되어드리고 싶어요</SubjectText>
          </SubjectTextContainer>
          <MenuRow
            text="메세지 올 자리"
            showIcon={false}
            showToggle={false}
            isEnabled={isInFormalMode}
            disabled={false}
            onPress={() => {
              console.log('편지');
            }}
          />
        </UserSettingContainer>
      )}
      <UserSettingContainer>
        <SubjectTextContainer>
          <SubjectText>대화방 관리</SubjectText>
        </SubjectTextContainer>
        <MenuRow
          text="반말 사용하기"
          showIcon={false}
          showToggle={true}
          isEnabled={isInFormalMode}
          disabled={false}
          onPress={async () => {
            switchChatTone(!isInFormalMode); //변경 사항을 서버에 patch로 업데이트
            setIsInformalMode(!isInFormalMode); //화면의 토글이 변경
            Analytics.clickChattingRoomSettingSwitch('반말 사용하기 (on/off)', !isInFormalMode);
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
