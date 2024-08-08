import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditUserInfo from '../components/pages/SettingPage/EditUserInfo'; //개인정보 수정 페이지
import PrivacyPolicy from '../components/pages/SettingPage/PrivacyPolicy'; //개인정보처리방침 페이지
import UserNotifications from '../components/pages/SettingPage/nitifications/notifications'; //알림설정 페이지
import ChannelTalk from '../components/pages/SettingPage/ChannelTalk'; //채널톡 페이지
import LicensePage from '../components/pages/SettingPage/LicensePage'; //오픈소스 라이센스 페이지
import LicenseDetailPage from '../components/pages/SettingPage/LicenseDetailPage'; //오픈소스 라이센스 상세 페이지
import Header from '../components/header/header';
import Deactivate from '../components/pages/SettingPage/deactivate/Deactivate';
import DeactivateReason from '../components/pages/SettingPage/deactivate/deactivate-reason/DeactivateReason';
import DeactivateAlert from '../components/pages/SettingPage/deactivate/dedactivate-alert/DeactivateAlert';

const Stack = createNativeStackNavigator();

const SettingStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EditUserInfo"
        component={EditUserInfo}
        options={{ header: () => <Header /> }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          header: () => <Header title="개인정보 처리방침" />,
        }}
      />
      <Stack.Screen
        name="UserNotifications"
        component={UserNotifications}
        options={{
          header: () => <Header title="알림 설정" />,
        }}
      />
      <Stack.Screen
        name="ChannelTalk"
        component={ChannelTalk}
        options={{
          header: () => <Header title="문의하기" />,
        }}
      />
      <Stack.Screen
        name="Deactivate"
        component={Deactivate}
        options={{ header: () => <Header title="개인정보 처리방침" /> }}
      />
      <Stack.Screen
        name="LicensePage"
        component={LicensePage}
        options={{ header: () => <Header title="오픈 라이센스" /> }}
      />
      <Stack.Screen name="LicenseDetailPage" component={LicenseDetailPage} />
      <Stack.Screen
        name="DeactivateReason"
        component={DeactivateReason}
        options={{ header: () => <Header /> }}
      />
      <Stack.Screen
        name="DeactivateAlert"
        component={DeactivateAlert}
        options={{ header: () => <Header /> }}
      />
    </Stack.Navigator>
  );
};
export default SettingStackNavigator;
