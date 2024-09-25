import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

//통계 컴포넌트를 감싸는 전체 컨테이너
export const Container = styled.View`
  flex: 1;
  gap: ${rsHeight * 30 + 'px'};
  padding-horizontal: ${rsWidth * 20 + 'px'};
`;

//키워드 제목
export const Title = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${18 * rsFont + 'px'};
  color: ${palette.neutral[900]};
`;

//아무것도 없을 때 컨테이너
export const EmptyContainer = styled.View`
  width: 100%;
  height: ${rsHeight * 220 + 'px'};
  background-color: white;
  border-radius: 10px;
  gap: ${rsHeight * 12 + 'px'};
  padding-vertical: ${rsHeight * 12 + 'px'};
  padding-horizontal: ${rsWidth * 12 + 'px'};
  justify-content: center;
  align-items: center;
`;

//아무것도 없을 때 안내 글
export const DescText = styled.Text`
  font-family: Pretendard-Regular;
  font-size: ${12 * rsFont}px;
  color: ${palette.neutral[300]};
  background-color: white;
  text-align: center;
`;
