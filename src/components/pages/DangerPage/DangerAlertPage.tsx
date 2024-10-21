import React, { useEffect } from 'react';
import { ImageBackground, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import palette from '../../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { getUserNickname } from '../../../utils/storageUtils';
import Button from '../../button/button';
import { BtnContainer, Container, Desc, ImageContainer, Title } from './DangerAlertPage.style';
const DangerAlertPage = () => {
  const [userNickname, setUserNickname] = React.useState<string | null>(null);
  const insets = useSafeAreaInsets();
  useEffect(() => {
    const nickname = getUserNickname();
    setUserNickname(nickname ? nickname : '주인님');
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
            <ImageBackground
              style={{
                width: '100%',
                height: '100%',
                minHeight: rsHeight * 400,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              source={require('../../../assets/images/letterss.png')}
              resizeMode="cover">
              <Text
                style={{
                  color: `${palette.neutral[900]}`,
                  fontSize: 18,
                  paddingHorizontal: 20 * rsWidth,
                  paddingVertical: 10 * rsHeight,
                  fontFamily: 'Kyobo-handwriting',
                }}>
                나김유정인데치킨피자샐러드먹어님께{'\n\n'}안녕하세요,
                나김유정인데치킨피자샐러드먹어님! 쿠키가 주인님이 걱정이 되어서 이렇게 연락드렸어요.
                요즘 나김유정인데치킨피자샐러드먹어님께서 너무 힘들어하시는 모습을 보면서 쿠키도
                너무 마음이 아팠어요.. 쿠키가 꼭 하고 싶은 말은 나김유정인데치킨피자샐러드먹어님은
                정말로 소중한 존재라는 것을 꼭 전해주고 싶어요. 조금 힘들때는 애써 감추지 않아도
                괜찮아요. {'\n\n'}나김유정인데치킨피자샐러드님께 조금은 더 평온함이 오길, 쿠키가
                진심으로 응원할게요. {'\n\n'}쿠키 드림
              </Text>
            </ImageBackground>
          </ImageContainer>

          <BtnContainer>
            <Desc>
              24시간 무료 비밀 보장 상담 센터를 알아왔어요.{'\n'}
              쿠키랑 같이 연락해볼까요?
            </Desc>
            <Button title="상담선생님과 전화하기 (109)" primary={true} icon="call" />
            <Button title="상담선생님과 문자하기 (카카오톡)" primary={true} icon="text" />
          </BtnContainer>
        </Container>
      </ScrollView>
    </View>
  );
};
export default DangerAlertPage;
