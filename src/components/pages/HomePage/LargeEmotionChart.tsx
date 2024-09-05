import React from 'react';
import { Text } from 'react-native-paper';
import {
  Title,
  Desc,
  EmotionLevel,
  LargeEmotionComponent,
  TitleContainer,
} from './EmotionChart.style';
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
//대분류 감정 차트
const LargeEmotionChart: React.FC = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const posNegEmotion = ['#3AD3EB', '#71C9D7', '#D2B9EE', '#EAB0C1', '#F49B9B'];
  return (
    <Container>
      <Title>오늘 기분은 어떠신가요?</Title>
      <EmotionLevel>
        <Icon name={'happy-emotion'} />
        {posNegEmotion.map((data, index) => (
          <LargeEmotionComponent color={data} key={index} />
        ))}
        <Icon name={'angry-emotion'} />
      </EmotionLevel>
      <Button
        title="기분 선택하기"
        primary={true}
        onPress={() =>
          navigation.navigate(RootStackName.HomeStackNavigator, {
            screen: HomeStackName.SmallEmotionChart,
          })
        }
      />
    </Container>
  );
};
export default LargeEmotionChart;
