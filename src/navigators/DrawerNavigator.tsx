import React from 'react';
import Header from '../components/header/Header';
import DangerAlertPage from '../pages/danger/DangerAlertPage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NewChat from '../pages/home/chat/NewChatPage';
import CustomDrawerContent from '../pages/home/DrawerContent';

const Drawer = createDrawerNavigator();

const DrawerNavigator: React.FC<{ initialScreen?: string }> = ({ initialScreen }) => {
  return (
    <Drawer.Navigator
      initialRouteName={initialScreen ?? 'NewChat'}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: 'right',
        drawerType: 'front',
      }}>
      <Drawer.Screen name={'NewChat'} component={NewChat} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
};
export default DrawerNavigator;
