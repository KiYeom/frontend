import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import palette from '../../../assets/styles/theme';
import { helloTexts, HomeStackName, RootStackName } from '../../../constants/Constants';
import Analytics from '../../../utils/analytics';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getUserNickname } from '../../../utils/storageUtils';
import Icon from '../../icons/icons';
import {
  CookieImage,
  HomeBtn,
  HomeBtnDescription,
  HomeBtnText,
  HomeBtnTitle,
  RiskCookieImage,
} from './HomeChatBtn.style';

const getRandomHello = (): string => {
  const randomIndex = Math.floor(Math.random() * helloTexts.length);
  return helloTexts[randomIndex];
};

const HomeChatBtn = ({ navigation, riskScore }) => {
  console.log('risk score' + riskScore);
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
        Analytics.clickTabHomeChatButton(riskScore);
        navigation.navigate(RootStackName.HomeStackNavigator, { screen: HomeStackName.Chat });
      }}
      status={'home'}
      riskScore={riskScore}>
      <HomeBtnTitle>
        {name}님,{'\n'}
        {hello}
      </HomeBtnTitle>
      <View>
        <HomeBtnDescription color={riskScore >= 85 ? palette.risk[200] : palette.primary[400]}>
          <HomeBtnText status={'home'}>쿠키와 대화하러 가기</HomeBtnText>
          <Icon
            name="arrow-right"
            width={rsWidth * 6 + 'px'}
            height={rsHeight * 12 + 'px'}
            color={palette.primary[50]}
          />
        </HomeBtnDescription>
      </View>
      {riskScore >= 85 ? (
        <RiskCookieImage
          style={{
            resizeMode: 'contain',
          }}
          source={require('../../../assets/images/homebuttonrainbowimage.png')}
        />
      ) : (
        <CookieImage
          style={{
            resizeMode: 'contain',
          }}
          source={require('../../../assets/images/homebuttonimage.png')}
        />
      )}
    </HomeBtn>
  );
};
export default HomeChatBtn;
