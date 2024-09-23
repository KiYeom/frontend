import React, { useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import requestNotificationPermission from '../../../utils/NotificationToken';
import EmotionBtn from '../../atoms/EmotionBtn/EmotionBtn';
import HomeChatBtn from '../../atoms/HomeBtn/HomeChatBtn';
import { HomeContainer } from './Home.style';

const Home: React.FC<any> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    //console.log('home 화면');
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
