import * as WebBrowser from 'expo-web-browser';
import React, { useEffect } from 'react';
import { ImageBackground, Linking, Platform, ScrollView, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KAKAO_MESSAGE, PHONE_NUMBER } from '../../../constants/Constants';
import Analytics from '../../../utils/analytics';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getUserNickname } from '../../../utils/storageUtils';
import Button from '../../button/button';
import {
  BtnContainer,
  Container,
  CookieLetterText,
  Desc,
  ImageContainer,
  Title,
} from './DangerAlertPage.style';

const cookieLetter = {
  image:
    'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/home/letter/cookieletter.png',
};

const DangerAlertPage = () => {
  const [userNickname, setUserNickname] = React.useState<string | null>(null);
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const nickname = getUserNickname();
    setUserNickname(nickname ? nickname : '주인님');
    Analytics.watchDangerLetterScreen();
  }, []);

  return (
    <View style={{ flex: 1, paddingBottom: insets.bottom }}>
      <ScrollView>
        <Container>
          <Title>
            {userNickname}님,{'\n'}
            쿠키가 편지를 보냈어요.
          </Title>
          <ImageContainer>
            {/*<Icon name="letter" />*/}
            <ImageBackground
              style={{
                width: 350 * rsWidth,
                height: 400 * rsHeight,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onLoadStart={() => {
                // setIsLoaded(false);
                console.log('이미지 로딩 시작: ', new Date().getTime());
              }}
              onLoadEnd={() => {
                setIsLoaded(true);
                console.log('이미지 로딩 완료: ', new Date().getTime());
              }}
              source={{ uri: cookieLetter.image }}>
              {!isLoaded ? (
                <ActivityIndicator size="large" color="#D1B385" />
              ) : (
                <CookieLetterText>
                  {userNickname}께{'\n\n'}안녕하세요, {userNickname}님! 쿠키가 주인님이 걱정이
                  되어서 이렇게 연락드렸어요. 요즘 {userNickname}께서 너무 힘들어하시는 모습을
                  보면서 쿠키도 너무 마음이 아팠어요.. 쿠키가 꼭 하고 싶은 말은 {userNickname}님은
                  정말로 소중한 존재라는 것을 꼭 전해주고 싶어요. 조금 힘들때는 애써 감추지 않아도
                  괜찮아요. {'\n\n'}
                  {userNickname}님께 조금은 더 평온함이 오길, 쿠키가 진심으로 응원할게요. {'\n\n'}
                  쿠키 드림
                </CookieLetterText>
              )}
            </ImageBackground>
          </ImageContainer>

          <BtnContainer>
            <Desc>
              24시간 무료 비밀 보장 상담 센터를 알아왔어요.{'\n'}
              쿠키랑 같이 연락해볼까요?
            </Desc>
            <Button
              title="상담선생님과 전화하기 (109)"
              primary={true}
              icon="call"
              onPress={() => {
                Analytics.clickDangerLetterCallButton();
                if (Platform.OS === 'android') {
                  Linking.openURL(`tel:${PHONE_NUMBER}`);
                } else {
                  // iOS에서 전화 걸기
                  Linking.openURL(`tel://${PHONE_NUMBER}`);
                }
              }}
            />
            <Button
              title="상담선생님과 문자하기 (카카오톡)"
              primary={true}
              icon="text"
              onPress={() => {
                Analytics.clickDangerLetterChatButton();
                WebBrowser.openBrowserAsync(`${KAKAO_MESSAGE}`);
              }}
            />
            <Button
              title="다른 상담 기관 알아보기"
              primary={true}
              icon="search"
              onPress={() => {
                Analytics.clickDangerLetterOtherClinicButton();
                WebBrowser.openBrowserAsync(
                  'https://autumn-flier-d18.notion.site/1268e75d989680f7b4f2d63d66f4a08a?pvs=4',
                ); //24시간 넘은 경우 -> 상담소로
              }}
            />
          </BtnContainer>
        </Container>
      </ScrollView>
    </View>
  );
};
export default DangerAlertPage;
