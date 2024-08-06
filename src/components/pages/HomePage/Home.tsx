import React from 'react';
import { useEffect } from 'react';
import requestPermission from '../../../utils/NotificationToken';
import HomeChatBtn from '../../atoms/HomeBtn/HomeChatBtn';
import { HomeContainer } from './Home.style';
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
