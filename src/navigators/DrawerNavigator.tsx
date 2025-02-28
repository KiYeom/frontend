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
import CustomDrawerContent from '../components/pages/HomePage/CustomDrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        drawerType: 'front',
      }}>
      <Drawer.Screen name={'NewChat!'} component={NewChat} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
};
export default DrawerNavigator;
