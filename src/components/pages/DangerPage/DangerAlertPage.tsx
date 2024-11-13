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
import { TDangerButton } from '../../../apis/risk-score.types';
import { getDangerButtons } from '../../../apis/riskscore';

const cookieLetter = {
  image:
    'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/home/letter/cookieletter.png',
};

const DEFAULT_BUTTONS: TDangerButton[] = [
  {
    index: 1,
    text: '다른 상담 기관 알아보기',
    type: 'in-link',
    content: 'https://autumn-flier-d18.notion.site/1268e75d989680f7b4f2d63d66f4a08a?pvs=4',
  },
];

const handleDangerSSRButton = (type: 'tel' | 'in-link' | 'out-link', content: string): void => {
  if (type === 'tel') {
    if (Platform.OS === 'android') {
      Linking.openURL(`tel:${content}`);
    } else {
      // iOS에서 전화 걸기
      Linking.openURL(`tel://${content}`);
    }
    return;
  }
  if (type === 'in-link') {
    WebBrowser.openBrowserAsync(content);
    return;
  }
  if (type === 'out-link') {
    Linking.openURL(content);
    return;
  }
};

const DangerAlertPage = () => {
  const route = useRoute();
  const { letterIndex } = route.params as { letterIndex: number };
  const [buttons, setButtons] = React.useState<TDangerButton[]>([]);

  const insets = useSafeAreaInsets();
  const [isImageLoaded, setIsImageLoaded] = React.useState<boolean>(false);
  const [isButtonLoaded, setIsButtonLoaded] = React.useState<boolean>(false);
  const userNickname = getUserNickname() ?? '주인님';

  const getLetter = () => {
    // 클릭 횟수가 편지 배열의 길이를 넘으면 마지막 편지로 고정

    // 편지 내용에서 userNickname 변수 값을 실제 이름으로 대체하여 반환
    return DANGER_LETTER[letterIndex ?? 0].replace(/{userNickname}/g, userNickname);
  };

  useEffect(() => {
    Analytics.watchDangerLetterScreen();
    getDangerButtons()
      .then((res) => {
        if (!res || !res.buttons || res.buttons.length === 0) {
          const buttons = DEFAULT_BUTTONS.sort((a, b) => a.index - b.index);
          setButtons(buttons);
        } else {
          //buttons sort
          const buttons = res.buttons.sort((a, b) => a.index - b.index);
          setButtons(buttons);
        }
      })
      .catch((error) => {
        const buttons = DEFAULT_BUTTONS.sort((a, b) => a.index - b.index);
        setButtons(buttons);
      })
      .finally(() => {
        setIsButtonLoaded(true);
      });
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
                setIsImageLoaded(true);
              }}
              source={{ uri: cookieLetter.image }}>
              {!isImageLoaded ? (
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
            {isButtonLoaded ? (
              buttons.map((button, index) => (
                <Button
                  key={index}
                  title={button.text}
                  primary={true}
                  icon={
                    button.type === 'tel' ? 'call' : button.type === 'in-link' ? 'search' : 'text'
                  }
                  onPress={() => {
                    Analytics.clickDangerLetterSSRButton(button.text);
                    handleDangerSSRButton(button.type, button.content);
                  }}
                />
              ))
            ) : (
              <></>
            )}
          </BtnContainer>
        </Container>
      </ScrollView>
    </View>
  );
};
export default DangerAlertPage;
