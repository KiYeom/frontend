import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditUserInfo from '../screen/SettingPage/EditUserInfo'; //개인정보 수정 페이지
import PrivacyPolicy from '../screen/SettingPage/PrivacyPolicy'; //개인정보처리방침 페이지
import UserNotifications from '../screen/SettingPage/UserNotification'; //알림설정 페이지
import ChannelTalk from '../screen/SettingPage/ChannelTalk'; //채널톡 페이지
import Deactivate from '../screen/SettingPage/Deactivate'; //회원탈퇴 고지
import LicensePage from '../screen/SettingPage/LicensePage'; //오픈소스 라이센스 페이지
import LicenseDetailPage from '../screen/SettingPage/LicenseDetailPage'; //오픈소스 라이센스 상세 페이지

const Stack = createNativeStackNavigator();

const SettingStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="EditUserInfo" component={EditUserInfo} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
      <Stack.Screen name="UserNotification" component={UserNotifications} />
      <Stack.Screen name="ChannelTalk" component={ChannelTalk} />
      <Stack.Screen name="Deactivate" component={Deactivate} />
      <Stack.Screen name="LicensePage" component={LicensePage} />
      <Stack.Screen name="LicenseDetailPage" component={LicenseDetailPage} />
    </Stack.Navigator>
  );
};
export default SettingStackNavigator;
