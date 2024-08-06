import React from 'react';
import './HomeChatBtn.style';
import { Leaf, Cookie } from './HomeChatBtn.style';
import { HomeBtnTitle, HomeBtnText, HomeBtn, ImageContainer } from './HomeChatBtn.style';
import { getUserNickname } from '../../../utils/storageUtils';

const HomeChatBtn = ({ navigation }) => {
  return (
    <HomeBtn onPress={() => navigation.navigate('HomeStackNavigator', { screen: 'Chat' })}>
      <HomeBtnTitle>
        {getUserNickname()}님,{'\n'}오늘은 어떤 하루를 보내셨나요?
      </HomeBtnTitle>
      <HomeBtnText>쿠키와 대화하러 가기</HomeBtnText>
      <ImageContainer>
        <Leaf source={require('../../../assets/images/HomeLeaf.png')} />
        <Cookie source={require('../../../assets/images/HomeCookie.png')} />
      </ImageContainer>
    </HomeBtn>
  );
};
export default HomeChatBtn;
