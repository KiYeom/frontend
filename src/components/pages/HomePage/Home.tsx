import React from 'react';
import { useEffect } from 'react';
import requestNotificationPermission from '../../../utils/NotificationToken';
import HomeChatBtn from '../../atoms/HomeBtn/HomeChatBtn';
import { HomeContainer } from './Home.style';
import EmotionBtn from '../../atoms/EmotionBtn/EmotionBtn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from 'react-native';

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
      {/*<Button
        title="Press me"
        onPress={() => {
          throw new Error('Hello, again, Sentry!');
        }}
      />*/}
    </HomeContainer>
  );
};

export default Home;
