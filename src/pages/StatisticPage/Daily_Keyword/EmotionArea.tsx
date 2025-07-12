import { css } from '@emotion/native';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { rsFont, rsWidth } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
import AnaylsisBlock from '../AnalysisBlock/AnalysisBlock';
import ReportEmotionCard from '../ReportEmotionCard/ReportEmotionCard';
import { TEmotionCheck } from '../../../apis/analyze.type';
//section : 그 때의 나는 어떤 감정이었나요?
//감정 카드들을 가로 스크롤로 표시하는 컴포넌트
type TEmotionAreaProps = {
  isRecordKeywordList: TEmotionCheck[];
};

const EmotionArea = ({ isRecordKeywordList }: TEmotionAreaProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{
        flexGrow: 1,
      }}
      contentContainerStyle={{
        flexGrow: 1,
        flexDirection: 'row',
        gap: rsWidth * 8,
      }}>
      {isRecordKeywordList.map((emotion, index) => (
        <ReportEmotionCard key={index} emotion={emotion} />
      ))}
    </ScrollView>
  );
};
export default EmotionArea;
