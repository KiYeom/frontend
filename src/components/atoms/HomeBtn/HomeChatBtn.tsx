import React from 'react';
import './HomeChatBtn.style';
import { CookieImage } from '../../pages/sign-in/sing-in.styles';
import { Leaf, Cookie } from './HomeChatBtn.style';
import { HomeBtnTitle, HomeBtnText, HomeBtn, ImageContainer } from './HomeChatBtn.style';

const HomeChatBtn = () => {
  return (
    <HomeBtn>
      <HomeBtnTitle>유정님,{'\n'}오늘은 어떤 하루를 보내셨나요?</HomeBtnTitle>
      <HomeBtnText>쿠키와 대화하러 가기</HomeBtnText>
      <ImageContainer>
        <Leaf source={require('../../../assets/images/HomeLeaf.png')} />
        <Cookie source={require('../../../assets/images/HomeCookie.png')} />
      </ImageContainer>
      {/*<Cookie source={require('../../../assets/images/HomeCookie.png')} />*/}
    </HomeBtn>
  );
};
export default HomeChatBtn;
