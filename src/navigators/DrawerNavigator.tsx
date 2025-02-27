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

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props) => (
  <DrawerContentScrollView {...props}>
    <DrawerItemList {...props} />
    <DrawerItem label="Help" onPress={() => Linking.openURL('https://mywebsite.com/help')} />
  </DrawerContentScrollView>
);

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
