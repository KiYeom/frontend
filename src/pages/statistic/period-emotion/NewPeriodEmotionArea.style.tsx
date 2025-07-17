// NewPeriodEmotionArea.style.tsx
import styled from '@emotion/native';
import { ViewStyle } from 'react-native';
import { rsHeight, rsWidth, rsFont } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';

// --- 상수 정의 ---
export const constants = {
  // 워드 클라우드 반지름/빈도 관련
  BASE_RADIUS: 90,
  RADIUS_DECREMENT: 15,
  MIN_RADIUS: 25,
  FREQUENCY_MULTIPLIER: 1.8,
  MIN_FREQUENCY: 40,

  // Container 패딩/간격
  VERTICAL_GAP: 12, // rsHeight * 12
  HORIZONTAL_PADDING: 20, // rsWidth * 20

  // 워드 클라우드 props
  CLOUD_SCALE: 180,

  // 범례 스타일
  LEGEND_GAP: 8, // rsWidth * 8
  LEGEND_DOT_SIZE: 8, // 8px
  LEGEND_DOT_RADIUS: 4, // 4px
  LEGEND_MARGIN_TOP: 8, // rsHeight * 8
  LEGEND_LABEL_FONT: 10, // rsFont * 10
};

// --- 최상위 컨테이너 (gap 및 horizontal padding) ---
// 최상위 컨테이너 (gap 및 padding 정의)
export const Container = styled.View`
  /* 아이템 간 세로 간격 */
  gap: 12px;
  justify-content: center;
`;

// --- 헤더 래퍼 (타이틀) ---
export const HeaderWrapper = styled.View`
  flex-direction: row;
  justify-content: flex-start;
`;

// --- 범례(legend) 전체 래퍼 ---
export const LegendWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  gap: ${constants.LEGEND_GAP * rsWidth}px;
  margin-top: ${constants.LEGEND_MARGIN_TOP * rsHeight}px;
`;

// --- 범례 아이템 (컬러 점 + 텍스트) ---
export const LegendItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${4 * rsWidth}px; /* 컬러 점과 레이블 사이 간격 */
`;

// --- 범례 컬러 도트 ---
export const LegendColorDot = styled.View<{ color: string }>`
  width: 10px;
  height: 10px;
  border-radius: ${constants.LEGEND_DOT_RADIUS}px;
  background-color: ${(props) => props.color};
`;

// --- 범례 레이블 텍스트 ---
export const LegendLabel = styled.Text`
  font-size: ${constants.LEGEND_LABEL_FONT * rsFont}px;
  color: ${palette.neutral[500]};
`;
// 카드 모양 배경 (워드 클라우드 또는 빈 상태 컨테이너)
export const CardContainer = styled.View`
  width: 100%;
  background-color: white;
  border-radius: 10px;
  border-color: ${palette.neutral[100]};
  border-width: 1px;
  overflow: hidden;
  justify-content: center;
  align-items: center;
`;
