import React from 'react';
import Header from '../components/header/header';
import DangerAlertPage from '../pages/DangerPage/DangerAlertPage';
import { createDrawerNavigator } from '@react-navigation/drawer';
import NewChat from '../pages/HomePage/chat/new-chat';
import CustomDrawerContent from '../pages/HomePage/CustomDrawerContent';

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
