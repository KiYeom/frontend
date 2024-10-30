import { css } from '@emotion/native';
import React from 'react';
import { ScrollView } from 'react-native';
import { rsWidth } from '../../../../utils/responsive-size';
import EmotionCard from '../../../atoms/EmotionCard/EmotionCard';
import BlurredButton from '../BlurredButton';
import { SectionTitle } from '../StatisticMain.style';
import { Container } from './Keyword.style';
const EmotionArea: React.FC<any> = (props: any) => {
  const { isRecordKeywordList, isNullRecordKeywordList } = props;
  return (
    <Container>
      <SectionTitle>그 때의 나는 어떤 감정이었나요?</SectionTitle>
      {isNullRecordKeywordList ? (
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
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={css`
            flex-grow: 1;
          `}
          contentContainerStyle={css`
            flex-grow: 1;
            flex-direction: row;
            gap: ${rsWidth * 8 + 'px'};
          `}>
          {isRecordKeywordList.map((emotion, index) => (
            <EmotionCard key={index} emotion={emotion} onPress={() => {}} status={'default-view'} />
          ))}
        </ScrollView>
      )}
    </Container>
  );
};
export default EmotionArea;
