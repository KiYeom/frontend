import React from 'react';
import { View, Text } from 'react-native';
import Setting from './Setting';
import SettingIcon from '../../../assets/icons/Setting.svg';
import AnalyzeIcon from '../../../assets/icons/Analyze.svg';
import HomeIcon from '../../../assets/icons/Home.svg';
import palette from '../../../assets/styles/theme';

const UserNotifications: React.FC = () => {
  return (
    <View>
      <Text>알림 설정 페이지</Text>
      <SettingIcon style={{ color: 'pink' }} />
      <AnalyzeIcon style={{ color: 'black' }} />
      <HomeIcon style={{ color: 'green' }} />
    </View>
  );
};
export default UserNotifications;
