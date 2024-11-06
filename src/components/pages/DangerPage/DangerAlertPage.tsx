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
import { DANGER_LETTER } from '../../../constants/Constants';
import {
  BtnContainer,
  Container,
  CookieLetterText,
  Desc,
  ImageContainer,
  Title,
} from './DangerAlertPage.style';
import { useRoute } from '@react-navigation/native';

const cookieLetter = {
  image:
    'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/home/letter/cookieletter.png',
};

const DangerAlertPage = () => {
  const route = useRoute();
  const { letterIndex } = route.params as { letterIndex: number };

  const insets = useSafeAreaInsets();
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const userNickname = getUserNickname() ?? '주인님';

  const getLetter = () => {
    // 클릭 횟수가 편지 배열의 길이를 넘으면 마지막 편지로 고정

    // 편지 내용에서 userNickname 변수 값을 실제 이름으로 대체하여 반환
    return DANGER_LETTER[letterIndex ?? 0].replace(/{userNickname}/g, userNickname);
  };

  useEffect(() => {
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
              onLoadEnd={() => {
                setIsLoaded(true);
              }}
              source={{ uri: cookieLetter.image }}>
              {!isLoaded ? (
                <ActivityIndicator size="large" color="#D1B385" />
              ) : (
                <CookieLetterText>{getLetter()}</CookieLetterText>
              )}
            </ImageBackground>
          </ImageContainer>

          <BtnContainer>
            <Desc>
              24시간 무료 비밀 보장 상담 센터를 알아왔어요.{'\n'}
              쿠키랑 같이 연락해볼까요?
            </Desc>
            {/* <Button
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
            /> */}
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
