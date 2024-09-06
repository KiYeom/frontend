import React from 'react';
import { Text } from 'react-native-paper';
import { Title, Desc, EmotionLevel, LargeEmotionComponent } from './EmotionChart.style';
import { Container } from './EmotionChart.style';
import { CTAContainer } from '../sign-up/input-name/input-name.styles';
import { View } from 'react-native-ui-lib';
import { HomeContainer } from './Home.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../button/button';
import Icon from '../../icons/icons';
import { rsWidth, rsHeight } from '../../../utils/responsive-size';
import { HomeStackName, RootStackName } from '../../../constants/Constants';
import HomeStackNavigator from '../../../navigators/HomeStackNavigator';
import { ButtonContainer } from '../sign-in/sing-in.styles';
import { useState } from 'react';
import { css } from '@emotion/native';

//대분류 감정 차트
const LargeEmotionChart: React.FC = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const posNegEmotion = ['#3AD3EB', '#71C9D7', '#D2B9EE', '#EAB0C1', '#F49B9B'];

  const [selectedEmotionIndex, setSelectedEmotionIndex] = useState(null); // 선택된 감정의 인덱스 저장

  // 감정 선택 핸들러
  const handleEmotionSelect = (index) => {
    if (selectedEmotionIndex === index) {
      // 이미 선택된 감정을 다시 클릭하면 선택 해제
      setSelectedEmotionIndex(null);
    } else {
      // 새로운 감정을 선택하면 해당 인덱스로 설정
      setSelectedEmotionIndex(index);
    }
  };

  return (
    <Container>
      <View
        style={css`
          padding-top: ${rsHeight * 40 + 'px'};
        `}>
        <Title>오늘 기분은 어떠신가요?</Title>
      </View>
      <EmotionLevel>
        <Icon name={'happy-emotion'} />
        {posNegEmotion.map((data, index) => (
          <LargeEmotionComponent
            color={data}
            key={index}
            onPress={() => handleEmotionSelect(index)}>
            {selectedEmotionIndex === index && <Icon name="check-icon" />}
          </LargeEmotionComponent>
        ))}
        <Icon name={'angry-emotion'} />
      </EmotionLevel>
      <View
        style={css`
          padding-vertical: ${rsHeight * 40 + 'px'};
          padding-horizontal: ${rsWidth * 24 + 'px'};
        `}>
        <Button
          title="기분 선택하기"
          primary={true}
          onPress={() =>
            navigation.navigate(RootStackName.HomeStackNavigator, {
              screen: HomeStackName.SmallEmotionChart,
            })
          }
        />
      </View>
    </Container>
  );
};
export default LargeEmotionChart;
