import React from 'react';
import Header from '../components/header/header';
import ClinicPage from '../components/pages/DangerPage/ClinicPage';
import DangerAlertPage from '../components/pages/DangerPage/DangerAlertPage';
import {
  DrawerContentScrollView,
  DrawerItemList,
  createDrawerNavigator,
  DrawerToggleButton,
  DrawerItem,
} from '@react-navigation/drawer';
import { Linking } from 'react-native';
import NewChat from '../components/pages/HomePage/new-chat';
import Icon from '../components/icons/icons';
import SwitchRow from '../components/switch-row/switch-row';
import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import {
  UserSettingContainer,
  SubjectTextContainer,
  SubjectText,
} from '../components/pages/SettingPage/Setting.style';
import MenuRow from '../components/menu-row/menu-row';
import SwitchComponent from '../components/switch/switch';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  //대화체를 관리하는 isCasualMode state
  const [isCasualMode, setIsCasualMode] = useState(true);
  return (
    <DrawerContentScrollView {...props}>
      {/*<SwitchRow
        title="반말 사용하기"
        isEnabled={isCasualMode}
        disabled={false}
        onPress={() => {
          setIsCasualMode(!isCasualMode);
          //console.log('눌렀음');
        }}
      />*/}
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
            //console.log('반말모드 상태 : ', isCasualMode);
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

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        drawerType: 'front',
      }}>
      <Drawer.Screen
        name={'NewChat'}
        component={NewChat}
        //options={{ header: () => <Header title="상담소 소개" /> }}
        /*options={{
          header: () => (
            <Header
              title="쿠키"
              isRight={true}
              rightIcon="side-menu-bar"
              rightFunction={() => console.log('햄버거 메뉴 클릭')}
            />
          ),
          drawerPosition: 'right',
          drawerType: 'front',
          //headerRight: () => <DrawerToggleButton />,
        }}*/
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
};
export default DrawerNavigator;
