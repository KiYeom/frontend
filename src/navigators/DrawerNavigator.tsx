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

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => {
  //대화체를 관리하는 isCasualMode state
  const [isCasualMode, setIsCasualMode] = useState(true);
  return (
    <DrawerContentScrollView {...props}>
      <SwitchRow
        title="반말 사용하기"
        isEnabled={isCasualMode}
        disabled={false}
        onPress={() => {
          setIsCasualMode(!isCasualMode);
          //console.log('눌렀음');
        }}
      />
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
        //headerLeft: false,
        //headerRight: () => <DrawerToggleButton />,
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
