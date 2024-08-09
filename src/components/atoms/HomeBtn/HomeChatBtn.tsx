import React from 'react';
import './HomeChatBtn.style';
import { HomeBtnTitle, HomeBtnText, HomeBtn, ImageContainer } from './HomeChatBtn.style';
import { getUserNickname } from '../../../utils/storageUtils';
import { rsHeight } from '../../../utils/responsive-size';
import { Image } from 'expo-image';

const HomeChatBtn = ({ navigation }) => {
  return (
    <HomeBtn onPress={() => navigation.navigate('HomeStackNavigator', { screen: 'Chat' })}>
      <HomeBtnTitle>
        {getUserNickname()}님,{'\n'}오늘은 어떤 하루를 보내셨나요?
      </HomeBtnTitle>
      <HomeBtnText>쿠키와 대화하러 가기</HomeBtnText>
      <ImageContainer>
        <Image
          source={require('../../../assets/images/homebuttonimage.png')}
          style={{
            height: rsHeight * 247,
            objectFit: 'contain',
          }}
        />
      </ImageContainer>
    </HomeBtn>
  );
};
export default HomeChatBtn;
