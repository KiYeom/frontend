//간단히 view와 text가 있는 페이지
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import MyModule from '../../../modules/my-module';
import { initSocket, connectSocket, disconnectSocket } from './socketManager';
import { getAccessToken } from '../../utils/storageUtils';
const CallPage: React.FC = () => {
  const [realTimeData, setRealTimeData] = useState('');
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const navigation = useNavigation();
  useEffect(() => {
    const userToken = getAccessToken();
    initSocket(userToken);
  }, []);

  return (
    <View style={{ paddingTop: 100 }}>
      <Text>소켓 상태: 버튼으로 연결</Text>
      <Text>{MyModule.hello()}</Text>
      <Button title="연결하기" onPress={connectSocket} />
      <Button title="끊기" onPress={disconnectSocket} />
      <Button title="테스트" onPress={() => console.log('hi')} />
    </View>
  );
};

export default CallPage;
