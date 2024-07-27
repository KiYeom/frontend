import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EditUserInfo from '../components/pages/SettingPage/EditUserInfo'; //개인정보 수정 페이지
import PrivacyPolicy from '../components/pages/SettingPage/PrivacyPolicy'; //개인정보처리방침 페이지
import UserNotifications from '../components/pages/SettingPage/UserNotification'; //알림설정 페이지
import ChannelTalk from '../components/pages/SettingPage/ChannelTalk'; //채널톡 페이지
import Deactivate from '../components/pages/SettingPage/Deactivate'; //회원탈퇴 고지
import LicensePage from '../components/pages/SettingPage/LicensePage'; //오픈소스 라이센스 페이지
import LicenseDetailPage from '../components/pages/SettingPage/LicenseDetailPage'; //오픈소스 라이센스 상세 페이지
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

const HeaderTitle: React.FC<any> = ({ title }) => <Text style={{ fontSize: 18 }}>{title}</Text>;

const SettingStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="EditUserInfo"
        component={EditUserInfo}
        options={{ headerTitle: () => <HeaderTitle title="유저 정보 수정하기" /> }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          headerTitle: () => <HeaderTitle title="개인정보 처리방침" />,
        }}
      />
      <Stack.Screen
        name="UserNotifications"
        component={UserNotifications}
        options={{ headerTitle: () => <HeaderTitle title="알림 설정" /> }}
      />
      <Stack.Screen
        name="ChannelTalk"
        component={ChannelTalk}
        options={{
          headerTitle: () => <HeaderTitle title="문의하기" />,
        }}
      />
      <Stack.Screen
        name="Deactivate"
        component={Deactivate}
        options={{ headerTitle: () => <HeaderTitle title="회원탈퇴" /> }}
      />
      <Stack.Screen
        name="LicensePage"
        component={LicensePage}
        options={{ headerTitle: () => <HeaderTitle title="오픈 라이센스" /> }}
      />
      <Stack.Screen
        name="LicenseDetailPage"
        component={LicenseDetailPage}
        options={{ headerBackVisible: false }}
      />
    </Stack.Navigator>
  );
};
export default SettingStackNavigator;
