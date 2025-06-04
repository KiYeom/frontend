//몽글몽글한 감정 버블 차트
import { css } from '@emotion/native';
import { TouchableOpacity, View, Text } from 'react-native';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { SectionTitle } from '../StatisticMain.style';
import Empty from '../Empty';
import palette from '../../../assets/styles/theme';
import Icon from '../../../components/icons/icons';
import Cloud from 'react-native-word-cloud';

const HINT_NAME = 'period-emotion';
const HINT_MESSAGE = '그 동안 자신이 가장 많이 느꼈던 감정이에요!';

// --- 대감정별 기본 색상 정의 ---

const EMOTION_COLORS = {
  anger: '#F49B9B', // 분노
  sadness: '#BCB2FF', // 슬픔 감정
  calm: '#ABEBC5', // 캄한 감정 (평온)
  happiness: '#FFE372', // 행복하고 액티브
};

// --- 상세 감정별 Intensity 및 Category 하드코딩 맵 ---
const EMOTION_INFO_MAP: {
  [key: string]: { intensity: number; category: 'anger' | 'sadness' | 'calm' | 'happiness' };
} = {
  // --- 분노 (anger) ---
  분노하는: { intensity: 0.9, category: 'anger' },
  짜증나는: { intensity: 0.7, category: 'anger' },
  괴로워하는: { intensity: 0.6, category: 'anger' },
  충격받은: { intensity: 0.5, category: 'anger' },
  '충격 받은': { intensity: 0.5, category: 'anger' }, // 띄어쓰기 버전 추가
  걱정스러운: { intensity: 0.3, category: 'anger' },

  // --- 슬픔 (sadness) ---
  우울한: { intensity: 0.9, category: 'sadness' },
  외로운: { intensity: 0.7, category: 'sadness' },
  후회되는: { intensity: 0.6, category: 'sadness' },
  두려운: { intensity: 0.5, category: 'sadness' },
  부끄러운: { intensity: 0.3, category: 'sadness' },

  // --- 평온 (calm) ---
  만족스러운: { intensity: 0.7, category: 'calm' },
  감사하는: { intensity: 0.5, category: 'calm' },
  사랑하는: { intensity: 0.4, category: 'calm' },

  // --- 행복 (happiness) ---
  신이난: { intensity: 0.8, category: 'happiness' },
  '신이 난': { intensity: 0.8, category: 'happiness' }, // 띄어쓰기 버전 추가
  자신있는: { intensity: 0.6, category: 'happiness' },
};

// EMOTION_INFO_MAP에 없는 감정에 대한 기본값 (혹시 모를 미정의 감정 대비)
const DEFAULT_EMOTION_INFO = { intensity: 0.5, category: 'calm' as const };

// --- 강도에 따른 색상 계산 함수 ---
const getEmotionColor = (category: string, intensity: number) => {
  const baseColor = EMOTION_COLORS[category as keyof typeof EMOTION_COLORS];

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
      return baseColor || '#ABEBC5'; // 기본값 추가
  }
};

// --- 컴포넌트 Props 타입 정의 ---
interface PeriodEmotionAreaProps {
  periodEmotionList: string[];
  hintStatus: string | null;
  setHintStatus: (name: string | undefined) => void;
}

const NewPeriodEmotionArea: React.FC<PeriodEmotionAreaProps> = (props) => {
  const { periodEmotionList, hintStatus, setHintStatus } = props;
  console.log('periodEmotionList', periodEmotionList);

  // --- 안전한 배열 체크 ---
  const isValidEmotionList = Array.isArray(periodEmotionList) && periodEmotionList.length > 0;

  // --- WordCloud용 데이터 변환 ---
  const wordCloudData = isValidEmotionList
    ? periodEmotionList
        .filter((emotionName) => emotionName && typeof emotionName === 'string')
        .slice(0, 6)
        .map((emotionName, index) => {
          const emotionInfo = EMOTION_INFO_MAP[emotionName] || DEFAULT_EMOTION_INFO;

          // 반지름 기반 빈도수 계산
          const baseRadius = 90;
          const radiusDecrement = 15;
          const targetRadius = Math.max(baseRadius - index * radiusDecrement, 25);
          const frequency = targetRadius * 1.8;

          return {
            keyword: emotionName,
            frequency: Math.max(frequency, 40),
            color: getEmotionColor(emotionInfo.category, emotionInfo.intensity),
          };
        })
        .filter((item) => item.keyword && item.frequency > 0)
        .sort((a, b) => b.frequency - a.frequency)
    : [];

  console.log('wordCloudData', wordCloudData);

  return (
    <View
      style={css`
        gap: ${12 * rsHeight + 'px'};
        padding-horizontal: ${rsWidth * 20 + 'px'};
      `}>
      <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
        <SectionTitle>그 동안 이러한 감정들을 느꼈어요</SectionTitle>
      </View>

      {isValidEmotionList && wordCloudData.length > 0 ? (
        <Cloud
          keywords={wordCloudData}
          scale={180}
          largestAtCenter={true}
          drawContainerCircle={false}
        />
      ) : (
        <Empty type="채팅기록" />
      )}

      {/* 범례 */}
      <View
        style={css`
          flex-direction: row;
          flex-wrap: wrap;
          gap: ${rsWidth * 8 + 'px'};
          margin-top: ${rsHeight * 8 + 'px'};
        `}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: EMOTION_COLORS.anger,
            }}
          />
          <Text style={{ fontSize: rsFont * 10, color: palette.neutral[500] }}>분노</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: EMOTION_COLORS.sadness,
            }}
          />
          <Text style={{ fontSize: rsFont * 10, color: palette.neutral[500] }}>슬픔</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: EMOTION_COLORS.calm,
            }}
          />
          <Text style={{ fontSize: rsFont * 10, color: palette.neutral[500] }}>평온</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: EMOTION_COLORS.happiness,
            }}
          />
          <Text style={{ fontSize: rsFont * 10, color: palette.neutral[500] }}>행복</Text>
        </View>
      </View>
    </View>
  );
};

export default NewPeriodEmotionArea;
