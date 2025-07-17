// NewPeriodKeywordArea.style.tsx
import styled from '@emotion/native';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';

// 계산에 사용할 상수들
export const constants = {
  CONTAINER_PADDING: 20,
  CARD_BORDER_RADIUS: 16,
  WORD_CLOUD_HEIGHT: 300,
  EMPTY_STATE_HEIGHT: 250,
  WORD_CLOUD_MIN_FONT: 12,
  WORD_CLOUD_MAX_FONT: 30,
  WORD_CLOUD_PADDING: 20,
  FONT_OFFSET: 8,
};

// 최상위 컨테이너 (gap 및 padding 정의)
export const Container = styled.View`
  /* 아이템 간 세로 간격 */
  gap: 12px;

  /* 좌우 여백: rsWidth * CONTAINER_PADDING */
  padding-horizontal: ${rsWidth * constants.CONTAINER_PADDING}px;
`;

// 헤더 부분 (타이틀을 감싸는 컨테이너)
export const HeaderContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
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

// 빈 상태(Empty) 컨테이너
export const EmptyContainer = styled.View`
  height: ${constants.EMPTY_STATE_HEIGHT * rsHeight}px;
  justify-content: center;
  align-items: center;
`;
