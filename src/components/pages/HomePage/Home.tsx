import React from 'react';
import { useEffect } from 'react';
import requestNotificationPermission from '../../../utils/NotificationToken';
import HomeChatBtn from '../../atoms/HomeBtn/HomeChatBtn';
import { HomeContainer } from './Home.style';
import EmotionBtn from '../../atoms/EmotionBtn/EmotionBtn';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button } from 'react-native';
import {
  Annotation,
  ContentContainer,
  CTAContainer,
  Title,
  TitleContaienr,
} from '../sign-up/input-name/input-name.styles';
import { FormContainer } from '../sign-up/input-profile/input-profile.styles';
import { Label } from '../sign-up/input-profile/input-profile.styles';
import Input from '../../input/input';
import palette from '../../../assets/styles/theme';
import { View, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { validateBirth } from '../../../utils/ValidateBirth';

const Home: React.FC<any> = ({ navigation }) => {
  const [birth, setBirth] = React.useState('');
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
