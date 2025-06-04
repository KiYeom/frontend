// NewPeriodEmotionArea.tsx
import React from 'react';
import { Text, View } from 'react-native';
import Cloud from 'react-native-word-cloud';
import Empty from '../Empty';
import { SectionTitle } from '../StatisticMain.style';
import {
  Container,
  HeaderWrapper,
  LegendWrapper,
  LegendItem,
  LegendColorDot,
  LegendLabel,
  constants,
} from './NewPeriodEmotionArea.style';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

// --- 대감정별 기본 색상 정의 ---
const EMOTION_COLORS = {
  anger: '#F49B9B', // 분노
  sadness: '#BCB2FF', // 슬픔
  calm: '#ABEBC5', // 평온
  happiness: '#FFE372', // 행복
};

// --- 상세 감정별 Intensity 및 Category 하드코딩 맵 ---
const EMOTION_INFO_MAP: {
  [key: string]: { intensity: number; category: 'anger' | 'sadness' | 'calm' | 'happiness' };
} = {
  // — 분노 (anger) —
  분노하는: { intensity: 0.9, category: 'anger' },
  짜증나는: { intensity: 0.7, category: 'anger' },
  괴로워하는: { intensity: 0.6, category: 'anger' },
  충격받은: { intensity: 0.5, category: 'anger' },
  '충격 받은': { intensity: 0.5, category: 'anger' },
  걱정스러운: { intensity: 0.3, category: 'anger' },

  // — 슬픔 (sadness) —
  우울한: { intensity: 0.9, category: 'sadness' },
  외로운: { intensity: 0.7, category: 'sadness' },
  후회되는: { intensity: 0.6, category: 'sadness' },
  두려운: { intensity: 0.5, category: 'sadness' },
  부끄러운: { intensity: 0.3, category: 'sadness' },

  // — 평온 (calm) —
  만족스러운: { intensity: 0.7, category: 'calm' },
  감사하는: { intensity: 0.5, category: 'calm' },
  사랑하는: { intensity: 0.4, category: 'calm' },

  // — 행복 (happiness) —
  신이난: { intensity: 0.8, category: 'happiness' },
  '신이 난': { intensity: 0.8, category: 'happiness' },
  자신있는: { intensity: 0.6, category: 'happiness' },
};

// EMOTION_INFO_MAP에 없는 감정에 대한 기본값
const DEFAULT_EMOTION_INFO = { intensity: 0.5, category: 'calm' as const };

// --- 강도에 따른 색상 계산 함수 ---
const getEmotionColor = (category: string, intensity: number) => {
  switch (category) {
    case 'anger':
      return intensity > 0.7 ? '#ee7b7b' : intensity > 0.5 ? '#f49b9b' : '#facece';
    case 'sadness':
      return intensity > 0.7 ? '#9c88fd' : intensity > 0.5 ? '#bcb2ff' : '#d9d5ff';
    case 'calm':
      return intensity > 0.6 ? '#7adba8' : intensity > 0.4 ? '#abebc5' : '#d5f6e1';
    case 'happiness':
      return intensity > 0.7 ? '#ffd54a' : intensity > 0.5 ? '#ffe372' : '#fce4e4';
    default:
      return EMOTION_COLORS[category as keyof typeof EMOTION_COLORS] || '#ABEBC5';
  }
};

// --- 컴포넌트 Props 타입 정의 ---
interface PeriodEmotionAreaProps {
  periodEmotionList: string[];
}

const NewPeriodEmotionArea: React.FC<PeriodEmotionAreaProps> = ({ periodEmotionList }) => {
  // --- 안전한 배열 체크 ---
  const isValidEmotionList = Array.isArray(periodEmotionList) && periodEmotionList.length > 0;

  // --- WordCloud용 데이터 변환 (최대 6개)
  const wordCloudData = isValidEmotionList
    ? periodEmotionList
        .filter((emotionName) => emotionName && typeof emotionName === 'string')
        .slice(0, 6)
        .map((emotionName, index) => {
          const emotionInfo = EMOTION_INFO_MAP[emotionName] || DEFAULT_EMOTION_INFO;

          // 반지름 기반 빈도수 계산 (index가 클수록 빈도가 낮아짐)
          const baseRadius = constants.BASE_RADIUS; // 90
          const radiusDecrement = constants.RADIUS_DECREMENT; // 15
          const targetRadius = Math.max(baseRadius - index * radiusDecrement, constants.MIN_RADIUS); // 최소 25
          const frequency = targetRadius * constants.FREQUENCY_MULTIPLIER; // 1.8

          return {
            keyword: emotionName,
            frequency: Math.max(frequency, constants.MIN_FREQUENCY), // 최소 40
            color: getEmotionColor(emotionInfo.category, emotionInfo.intensity),
          };
        })
        .filter((item) => item.keyword && item.frequency > 0)
        .sort((a, b) => b.frequency - a.frequency)
    : [];

  return (
    <View style={{ paddingLeft: 20 }}>
      <Container>
        {/* 헤더 */}
        <HeaderWrapper>
          <SectionTitle>그 동안 이러한 감정들을 느꼈어요</SectionTitle>
        </HeaderWrapper>

        {/* 워드 클라우드 */}
        {isValidEmotionList && wordCloudData.length > 0 ? (
          <Cloud
            keywords={wordCloudData}
            scale={constants.CLOUD_SCALE}
            largestAtCenter={true}
            drawContainerCircle={false}
          />
        ) : (
          <Empty type="채팅기록" />
        )}
      </Container>
    </View>
  );
};

export default NewPeriodEmotionArea;
