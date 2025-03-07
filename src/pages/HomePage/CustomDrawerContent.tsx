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
import { useNavigation } from '@react-navigation/native';
import Analytics from '../../utils/analytics';
import { switchChatTone, getUserInfo } from '../../apis/setting';
import { getRiskScore } from '../../apis/riskscore';
import { getRiskData, setRiskData } from '../../utils/storageUtils';
import { getKoreanServerTodayDateString } from '../../utils/times';
import { RISK_SCORE_THRESHOLD } from '../../constants/Constants';
import { DANGER_LETTER, DangerStackName, RootStackName } from '../../constants/Constants';
import { useRiskStoreVer2 } from '../../store/useRiskStoreVer2';

const CustomDrawerContent = (props: any) => {
  //대화체를 관리하는 isCasualMode state
  const [isInFormalMode, setIsInformalMode] = useState(true);
  //위험 점수와 상태를 관리하는 state
  const [riskScore, setRiskScore] = React.useState<number>(0);
  const [riskStatus, setRiskStatus] = React.useState<'safe' | 'danger' | 'danger-opened'>('safe');
  const navigation = useNavigation();
  const { riskScoreV2, riskStatusV2, setRiskScoreV2, setRiskStatusV2, setHandleDangerPressV2 } =
    useRiskStoreVer2();

  useEffect(() => {
    Analytics.watchOpenedSideMenuScreen();
    getUserInfo() //반말 존댓말 정보 가져옴
      .then((res) => {
        if (res) {
          setIsInformalMode(res.isInFormal);
        } else {
          return;
        }
      })
      .catch((error) => {
        console.log('catch');
      });
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      {(riskStatusV2 === 'danger' || riskStatusV2 === 'danger-opened') && (
        <UserSettingContainer>
          <SubjectTextContainer>
            <SubjectText>
              {riskStatusV2 === 'danger'
                ? '쿠키에게 편지가 왔어요'
                : '언제나 곁에서 힘이 되어드리고 싶어요'}
            </SubjectText>
          </SubjectTextContainer>
          <MenuRow
            showIcon={false}
            showEventIcon={true}
            eventName={riskStatusV2 === 'danger' ? 'danger-sign' : 'danger-sign-opened'}
            isEnabled={isInFormalMode}
            shouldBlockTouch={true}
            onPress={() => {
              //쿠키 편지 화면으로 이동한다
              console.log('쿠키 편지를 클릭함');
              if (riskStatusV2 === 'danger') {
                console.log('위험 상태일 때');
                Analytics.clickDangerLetterButton(riskScore);
                /*const letterIndex = Math.floor(Math.random() * DANGER_LETTER.length);
                setRiskData({
                  timestamp: new Date().getTime(),
                  isRead: true,
                  letterIndex,
                });*/
                setHandleDangerPressV2();
                navigation.navigate(RootStackName.DangerStackNavigator, {
                  screen: DangerStackName.DangerAlert,
                  params: { letterIndex: getRiskData()?.letterIndex ?? 0 },
                }); //쿠키 편지 화면으로 이동한다
                return;
              }
              if (riskStatusV2 === 'danger-opened') {
                //위험한 상태일 때 확인을 했으면
                console.log('위험 상태일 때 확인을 했으면');
                Analytics.clickOpenedDangerLetterButton(riskScore);
                //const letterIndex = getRiskData()?.letterIndex;
                navigation.navigate(RootStackName.DangerStackNavigator, {
                  screen: DangerStackName.DangerAlert,
                  params: { letterIndex: getRiskData()?.letterIndex ?? 0 },
                }); //쿠키 편지 화면으로 이동한다
                return;
              }
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
          shouldBlockTouch={true}
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

///
/*const refreshRiskScore = () => {
    const date = getKoreanServerTodayDateString(new Date());
    getRiskScore(date).then((res) => {
      setRiskScore(res);
      if (res >= RISK_SCORE_THRESHOLD && !getRiskData()) {
        setRiskData({
          timestamp: new Date().getTime(),
          isRead: false,
          letterIndex: null,
        });
      }
      refreshRiskStatus();
    });
  };*/

/*const refreshRiskStatus = () => {
    const riskData = getRiskData();
    if (!riskData) setRiskStatus('safe');
    else if (riskData.isRead) setRiskStatus('danger-opened');
    else setRiskStatus('danger');
  };*/
/*
  사이드바를 오픈했을 때 실행되는 useEffect 훅
  1. 사이드바가 오픈되면 유저의 대화 문체 정보를 서버에서 가져와서 isFormalMode state를 업데이트한다.
   */

//이 화면에 왔을 때는 props를 내려 받아야 할 것 같은데....
//과연 이제까지 리스너를 달아서, 마운트 되는 것을 확인하고 risk 점수를 가지고 오는게 맞는지 전혀 모르겠음

/*useEffect(() => {
    const unsubscribe = navigation.addListener('focus', setRiskScoreV2);
    //스크린이 포커스 될 때마다 refreshRiskScore 함수를 실행하여 위험 상태를 safe / danger / danger-opened 로 변경한다
    return () => {
      // 컴포넌트 unmount 시 리스너를 해제
      unsubscribe();
    };
  }, [navigation]);*/
