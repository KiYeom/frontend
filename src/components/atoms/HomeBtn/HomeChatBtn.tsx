import React, { useEffect } from 'react';
import './HomeChatBtn.style';
import { HomeBtnTitle, HomeBtnText, HomeBtn, ImageContainer } from './HomeChatBtn.style';
import { getUserNickname } from '../../../utils/storageUtils';
import { rsHeight } from '../../../utils/responsive-size';
import { Image } from 'expo-image';
import { HomeStackName, RootStackName } from '../../../constants/Constants';

const HomeChatBtn = ({ navigation }) => {
  const [name, setName] = React.useState<string>('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setName(getUserNickname() + '');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <HomeBtn
      onPress={() =>
        navigation.navigate(RootStackName.HomeStackNavigator, { screen: HomeStackName.Chat })
      }>
      <HomeBtnTitle>
        {name}님,{'\n'}오늘은 어떤 하루를 보내셨나요?
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
