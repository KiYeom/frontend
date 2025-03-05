import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

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

//INFO : 변경
export const DateLineContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${rsWidth * 4 + 'px'};
`;

//변경된 날짜 폰트
export const DateLineText = styled.Text`
  font-family: Kyobo-handwriting;
  font-size: ${16 * rsFont + 'px'};
  color: ${palette.neutral[500]};
  text-align: center;
`;
//변경된 리포트 제목 폰트
export const StatisticTitle = styled.Text`
  font-family: Kyobo-handwriting;
  font-size: ${24 * rsFont + 'px'};
  color: ${palette.neutral[900]};
  text-align: center;
`;

//변경된 색션 제목 폰트
export const SectionTitle = styled.Text`
  font-family: Kyobo-handwriting;
  font-size: ${18 * rsFont + 'px'};
  color: ${palette.neutral[900]};
`;

export const PageHintText = styled.Text`
  font-family: Pretendard-Regular;
  font-size: ${16 * rsFont + 'px'};
  color: black;
  margin: 0 ${rsWidth * 24 + 'px'} 0 ${rsWidth * 24 + 'px'};
`;
