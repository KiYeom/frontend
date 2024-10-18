import { Image } from 'expo-image';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import { getUserNickname } from '../../../utils/storageUtils';
import Button from '../../button/button';
import { BtnContainer, Container, Desc, ImageContainer, Title } from './DangerAlertPage.style';
const DangerAlertPage = () => {
  const [userNickname, setUserNickname] = React.useState<string | null>(null);
  useEffect(() => {
    setUserNickname(getUserNickname());
  }, []);
  return (
    <Container>
      <Title>
        {userNickname}님,{'\n'}
        쿠키가 편지를 보냈어요.
      </Title>
      <ImageContainer>
        <Image
          style={{ width: '100%', height: '100%' }}
          source={require('../../../assets/images/letter.jpg')}
        />
      </ImageContainer>

      <BtnContainer>
        <Desc>
          24시간 무료 비밀 보장 상담 센터를 알아왔어요.{'\n'}
          쿠키랑 같이 연락해볼까요?
        </Desc>
        <Button title="상담선생님과 전화하기 (109)" primary={true} icon="call" />
        <Button title="상담선생님과 문자하기 (카카오톡)" primary={true} icon="text" />
      </BtnContainer>
      <View style={{ backgroundColor: 'black', flexDirection: 'row', width: '100%' }}>
        <Text>fdaf</Text>
      </View>
    </Container>
  );
};
export default DangerAlertPage;
