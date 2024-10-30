import { css } from '@emotion/native';
import React from 'react';
import { Text, View } from 'react-native';
import palette from '../../../../assets/styles/theme';
import { rsHeight } from '../../../../utils/responsive-size';
import BlurredButton from '../BlurredButton';
import { SectionTitle } from '../StatisticMain.style';
import { Container } from './Keyword.style';
const EmotionDairy: React.FC<any> = (props: any) => {
  const { todayFeeling } = props;
  return (
    <Container>
      <SectionTitle>그 때의 나는 어떤 생각을 했을까요?</SectionTitle>
      {!todayFeeling ? (
        <BlurredButton
          blurredImageUri={
            'https://raw.githubusercontent.com/KiYeom/assets/refs/heads/main/statistic/sampleemotionkeyword.png'
          } // 로컬에 저장된 블러 이미지 경로
          text={'지금 내 마음속\n이야기를 들어볼까요?'}
          buttonText="감정 일기 작성하기"
          onPress={() => {
            // 버튼 클릭 시 실행될 함수
            console.log('세번째 버튼 클릭됨');
            //navigation.replace(RootStackName.HomeStackNavigator, { screen: HomeStackName.Chat });
            // 채팅 화면으로 가는데, 채팅 화면의 뒤로가기 버튼을 누르면 이 화면 말고 홈 화면으로 가야할 것 같음..
            console.log('버튼 클릭함');
          }}
        />
      ) : (
        <View
          style={css`
            background-color: white;
            padding: ${rsHeight * 18 + 'px'};
            border-radius: 10px;
          `}>
          <Text
            style={css`
              color: ${palette.neutral[500]};
            `}>
            {todayFeeling === null ? '' : todayFeeling}
          </Text>
        </View>
      )}
    </Container>
  );
};
export default EmotionDairy;
