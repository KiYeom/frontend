import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const MAX_WIDTH = 350;

//통계 개별 요소를 감싸는 컴포넌트
export const Container = styled.View`
  width: 100%;
  max-width: ${MAX_WIDTH * rsWidth + 'px'};
  height: auto;
  gap: ${12 * rsHeight + 'px'};
  background-color: green;
`;

//변경된 색션 제목 폰트
export const SectionTitle = styled.Text`
  font-family: Kyobo-handwriting;
  font-size: ${18 * rsFont + 'px'};
  color: ${palette.neutral[900]};
  background-color: white;
`;
