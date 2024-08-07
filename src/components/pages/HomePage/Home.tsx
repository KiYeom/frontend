import React from 'react';
import { useEffect } from 'react';
import requestPermission from '../../../utils/NotificationToken';
import HomeChatBtn from '../../atoms/HomeBtn/HomeChatBtn';
import { HomeContainer } from './Home.style';
import { TypingAnimation } from 'react-native-typing-animation';
import { View, Text } from 'react-native-ui-lib';
import { rsFont, rsWidth, rsHeight } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
import { useState } from 'react';
const Home: React.FC<any> = ({ navigation }) => {
  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <HomeContainer>
      <HomeChatBtn navigation={navigation} />
    </HomeContainer>
  );
};

export default Home;
