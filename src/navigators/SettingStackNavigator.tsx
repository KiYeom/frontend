import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import Header from '../components/header/header';
//import ChannelTalk from '../components/pages/SettingPage/ChannelTalk'; //채널톡 페이지
import DeactivateReason from '../pages/SettingPage/deactivate/deactivate-reason/DeactivateReason';
import DeactivateAlert from '../pages/SettingPage/deactivate/deactivate-alert/DeactivateAlert';
import EditUserInfo from '../pages/SettingPage/editInfo/EditUserInfo'; //개인정보 수정 페이지
import LicenseDetailPage from '../pages/SettingPage/license/LicenseDetailPage'; //오픈소스 라이센스 상세 페이지
import LicensePage from '../pages/SettingPage/license/LicensePage'; //오픈소스 라이센스 페이지
import UserNotifications from '../pages/SettingPage/notifications/notifications'; //알림설정 페이지
import Chattingsetting from '../pages/SettingPage/chattingsetting/chattingsetting';
import OrganizationConnect from '../pages/SettingPage/organization/organization-connect/organization-connect';
import OrganizationStatus from '../pages/SettingPage/organization/organization-status/organization-status';
//import PrivacyPolicy from '../components/pages/SettingPage/PrivacyPolicy'; //개인정보처리방침 페이지
import { SettingStackName } from '../constants/Constants';

const SettingStack = createNativeStackNavigator();

const SettingStackNavigator: React.FC = () => {
  return (
    <SettingStack.Navigator>
      <SettingStack.Screen
        name={SettingStackName.EditUserInfo}
        component={EditUserInfo}
        options={{ header: () => <Header title="" /> }}
      />
      {/*<SettingStack.Screen
        name={SettingStackName.PrivacyPolicy}
        component={PrivacyPolicy}
        options={{
          header: () => <Header title="개인정보 처리방침" />,
        }}
      />*/}
      <SettingStack.Screen
        name={SettingStackName.UserNotifications}
        component={UserNotifications}
        options={{
          header: () => <Header title="알림 설정" />,
        }}
      />
      <SettingStack.Screen
        name={SettingStackName.UserChattingSetting}
        component={Chattingsetting}
        options={{
          header: () => <Header title="대화방 설정" />,
        }}
      />
      <SettingStack.Screen
        name={SettingStackName.LicensePage}
        component={LicensePage}
        options={{ header: () => <Header title="오픈소스 라이센스" /> }}
      />
      <SettingStack.Screen
        name={SettingStackName.LicenseDetailPage}
        component={LicenseDetailPage}
      />
      <SettingStack.Screen
        name={SettingStackName.DeactivateAlert}
        component={DeactivateAlert}
        options={{ header: () => <Header /> }}
      />
      <SettingStack.Screen
        name={SettingStackName.DeactivateReason}
        component={DeactivateReason}
        options={{ header: () => <Header /> }}
      />
      <SettingStack.Screen
        name={SettingStackName.OrganizationConnect}
        component={OrganizationConnect}
        options={{ header: () => <Header /> }}
      />
      <SettingStack.Screen
        name={SettingStackName.OrganizationStatus}
        component={OrganizationStatus}
        options={{ header: () => <Header /> }}
      />
    </SettingStack.Navigator>
  );
};
export default SettingStackNavigator;
