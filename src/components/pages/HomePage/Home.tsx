import React from 'react';
import { useEffect } from 'react';
import requestNotificationPermission from '../../../utils/NotificationToken';
import HomeChatBtn from '../../atoms/HomeBtn/HomeChatBtn';
import { HomeContainer } from './Home.style';
import EmotionBtn from '../../atoms/EmotionBtn/EmotionBtn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Home: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <HomeContainer insets={insets}>
      <HomeChatBtn navigation={navigation} />
      <EmotionBtn navigation={navigation} />
    </HomeContainer>
  );
};

export default Home;
