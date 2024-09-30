import * as amplitude from '@amplitude/analytics-react-native';
import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import palette from '../../../assets/styles/theme';
import { helloTexts, HomeStackName, RootStackName } from '../../../constants/Constants';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getUserNickname } from '../../../utils/storageUtils';
import Icon from '../../icons/icons';
import './HomeChatBtn.style';
import {
  CookieImage,
  HomeBtn,
  HomeBtnDescription,
  HomeBtnText,
  HomeBtnTitle,
} from './HomeChatBtn.style';

const getRandomHello = (): string => {
  const randomIndex = Math.floor(Math.random() * helloTexts.length);
  return helloTexts[randomIndex];
};

const HomeChatBtn = ({ navigation }) => {
  const [name, setName] = React.useState<string>('');
  const hello = getRandomHello();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setName(getUserNickname() + '');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <HomeBtn
      os={Platform.OS}
      onPress={() => {
        navigation.navigate(RootStackName.HomeStackNavigator, { screen: HomeStackName.Chat });
        amplitude.track('채팅 버튼 클릭');
      }}
      status={'home'}>
      <HomeBtnTitle>
        {name}님,{'\n'}
        {hello}
      </HomeBtnTitle>
      <View>
        <HomeBtnDescription color={palette.primary[400]}>
          <HomeBtnText status={'home'}>쿠키와 대화하러 가기</HomeBtnText>
          <Icon
            name="arrow-right"
            width={rsWidth * 6 + 'px'}
            height={rsHeight * 12 + 'px'}
            color={palette.primary[50]}
          />
        </HomeBtnDescription>
      </View>
      <CookieImage
        style={{
          resizeMode: 'contain',
        }}
        source={require('../../../assets/images/homebuttonimage.png')}
      />
    </HomeBtn>
  );
};
export default HomeChatBtn;
