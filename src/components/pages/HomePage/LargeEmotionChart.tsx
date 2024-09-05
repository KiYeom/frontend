import React from 'react';
import { Text } from 'react-native-paper';
import { Title, Desc, EmotionLevel, LargeEmotionComponent } from './EmotionChart.style';
import { View } from 'react-native-ui-lib';
import { HomeContainer } from './Home.style';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../button/button';
import Icon from '../../icons/icons';
import { rsWidth, rsHeight } from '../../../utils/responsive-size';
//대분류 감정 차트
const LargeEmotionChart: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <HomeContainer insets={insets}>
      <Title>감정 기록</Title>
      <Desc>오늘의 기분이 어떠세요?</Desc>
      <EmotionLevel>
        <Icon name={'happy-emotion'} />
        <Icon name={'sad-emotion'} />
        <LargeEmotionComponent />
        <LargeEmotionComponent />
        <LargeEmotionComponent />
        <LargeEmotionComponent />
        <LargeEmotionComponent />
      </EmotionLevel>
      <Button title="기분 선택하기" primary={true} />
    </HomeContainer>
  );
};
export default LargeEmotionChart;
