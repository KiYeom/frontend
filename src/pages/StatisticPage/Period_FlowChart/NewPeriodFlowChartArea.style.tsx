// EmotionsFlowChart.style.tsx

import styled from '@emotion/native';
import { Dimensions } from 'react-native';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
import { SectionTitle } from '../StatisticMain.style';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 차트 주변 여백 계산에 사용할 상수들
const HORIZONTAL_PADDING = 16 * 2; // Container의 paddingHorizontal: 16px * 2
const ICON_COLUMN_WIDTH = 30; // 왼쪽 아이콘 열 너비
const ICON_CHART_GAP = 0; // 아이콘 열과 차트 사이 간격
const YAXIS_LABEL_AREA = 30; // y축 숫자 레이블 영역 확보

// 수정된 계산
export const CHART_WIDTH = SCREEN_WIDTH - HORIZONTAL_PADDING - ICON_COLUMN_WIDTH - ICON_CHART_GAP;
// 차트 높이 및 밴드 높이
export const CHART_HEIGHT = 280;
export const STRIPE_HEIGHT = CHART_HEIGHT / 5; // 280 / 5 = 56

// ───────────────────────────────────────────────────────────
// 컨테이너: 좌우 padding, 상하 padding, 백그라운드색, 가운데 정렬
// ───────────────────────────────────────────────────────────
export const Container = styled.View`
  padding-horizontal: 16px;
  padding-vertical: 16px;
  //background-color: ${palette.neutral[50]}; // 필요에 따라 컬러 조정
  align-items: center;
  gap: 12px;
  //background-color: red;
`;

// ───────────────────────────────────────────────────────────
// ChartAreaWrapper: 왼쪽 아이콘 열과 오른쪽 차트를 가로로 배치
// ───────────────────────────────────────────────────────────
export const ChartAreaWrapper = styled.View`
  flex-direction: row;
  align-items: stretch;
  //background-color: pink;
`;

// ───────────────────────────────────────────────────────────
// IconsColumn: 왼쪽 감정 아이콘 열
//   - width: 30px
//   - 아이콘들을 세로로 5등분하여 space-between으로 배치
// ───────────────────────────────────────────────────────────
export const IconsColumn = styled.View`
  width: ${ICON_COLUMN_WIDTH + 'px'};
  height: ${CHART_HEIGHT + 'px'}; // 추가
  position: relative; // 추가
  align-items: center;
  //background-color: purple;
`;

// ───────────────────────────────────────────────────────────
// IconWrapper: 개별 아이콘 래퍼 (아이콘 크기를 24x24로 설정)
// ───────────────────────────────────────────────────────────
export const IconWrapper = styled.View`
  width: 24px;
  height: 24px;
  justify-content: center;
  align-items: center;
`;

// ───────────────────────────────────────────────────────────
// IconText: (이모지 사용 시) 텍스트 크기
// ───────────────────────────────────────────────────────────
export const IconText = styled.Text`
  font-size: 24px;
`;

// ───────────────────────────────────────────────────────────
// ChartWrapper: 실제 차트와 배경 스트라이프를 겹치기 위한 래퍼
//   - width: CHART_WIDTH
//   - height: CHART_HEIGHT
//   - position: relative (안에 absolute 요소가 들어갈 예정)
// ───────────────────────────────────────────────────────────
export const ChartWrapper = styled.View`
  width: ${CHART_WIDTH}px;
  height: ${CHART_HEIGHT}px;
  position: relative;
  //background-color: blue;
`;

// ───────────────────────────────────────────────────────────
// StripeBand: 배경 스트라이프(밴드) 컴포넌트
//   - 위치(top), 높이, 배경색, 가로폭은 props로 전달
// ───────────────────────────────────────────────────────────
export const StripeBand = styled.View<{
  top: number;
  bgColor: string;
}>(({ top, bgColor }) => ({
  position: 'absolute',
  top: top,
  left: 0, // initialSpacing 보정
  width: CHART_WIDTH + 5, // 양쪽 spacing 포함
  height: STRIPE_HEIGHT,
  backgroundColor: bgColor,
}));

// ───────────────────────────────────────────────────────────
// EmptyContainer: 데이터가 없을 때 보여줄 높이 고정 컨테이너
// ───────────────────────────────────────────────────────────
export const EmptyContainer = styled.View`
  height: ${CHART_HEIGHT}px;
  justify-content: center;
  align-items: center;
`;

// ───────────────────────────────────────────────────────────
// EmptyText: 데이터 없을 때 보여줄 텍스트 스타일
// ───────────────────────────────────────────────────────────
export const EmptyText = styled.Text`
  color: ${palette.neutral[300]};
  font-size: 14px;
`;
