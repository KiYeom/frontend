import React, { useEffect } from 'react';
import { Platform, View } from 'react-native';
import palette from '../../assets/styles/theme';
import { helloTexts, HomeStackName, RootStackName } from '../../constants/Constants';
import Analytics from '../../utils/analytics';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import { getUserNickname, setRefreshChat } from '../../utils/storageUtils';
import Icon from '../icons/icons';
import {
  CookieImage,
  HomeBtnContainer,
  HomeBtnDescription,
  HomeBtnText,
  HomeBtnTitle,
  RiskCookieImage,
} from './HomeChatBtn.style';
import { useRiskStoreVer2 } from '../../store/useRiskStoreVer2';

const getRandomHello = (): string => {
  const randomIndex = Math.floor(Math.random() * helloTexts.length);
  return helloTexts[randomIndex];
};

const HomeChatBtn = ({ navigation }) => {
  const { riskStatusV2, riskScoreV2 } = useRiskStoreVer2();
  const [name, setName] = React.useState<string>('');
  const hello = getRandomHello();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setName(getUserNickname() + '');
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);
  //console.log('😀😀😀😀😀😀😀', riskStatusV2);

  return (
    <HomeBtnContainer
      os={Platform.OS}
      onPress={() => {
        Analytics.clickTabHomeChatButton(riskScoreV2);
        setRefreshChat(0);
        navigation.navigate(RootStackName.HomeStackNavigator, {
          screen: HomeStackName.NewChat,
        }); //쿠키 편지 화면으로 이동한다
        //navigation.navigate(RootStackName.HomeStackNavigator, { screen: HomeStackName.NewChat });
      }}
      usage={'home'}
      riskStatus={riskStatusV2}>
      <HomeBtnTitle>
        {name}님,{'\n'}
        {hello}
      </HomeBtnTitle>
      {/*<View>*/}
      <HomeBtnDescription
        color={riskStatusV2 === 'safe' ? palette.primary[400] : palette.risk[200]}>
        <HomeBtnText status={'home'}>쿠키와 대화하러 가기</HomeBtnText>
        <Icon
          name="arrow-right"
          width={rsWidth * 6 + 'px'}
          height={rsHeight * 12 + 'px'}
          color={palette.primary[50]}
        />
      </HomeBtnDescription>
      {/*</View>*/}
      {riskStatusV2 === 'safe' ? (
        <RiskCookieImage
          style={{
            resizeMode: 'contain',
          }}
          source={require('@assets/images/homebuttonrainbowimage.png')}
        />
      ) : (
        <CookieImage
          style={{
            resizeMode: 'contain',
          }}
          source={require('@assets/images/homebuttonimage.png')}
        />
      )}
    </HomeBtnContainer>
  );
};
export default HomeChatBtn;
