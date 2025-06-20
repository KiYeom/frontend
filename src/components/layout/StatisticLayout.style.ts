import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
/*
  DateLineContainer,
  DateLineText,
  StatisticTitle,*/

//날짜 폰트
export const DateLineText = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${16 * rsFont + 'px'};
  color: white;
  text-align: center;
`;

//날짜 컴포넌트
export const DateLineContainer = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${rsHeight * 5 + 'px'};
  background-color: ${palette.neutral[900]};
  padding-horizontal: ${rsWidth * 10 + 'px'};
  padding-vertical: ${rsHeight * 5 + 'px'};
  border-radius: 20px;
`;

//변경된 리포트 제목 폰트
export const StatisticTitle = styled.Text`
  font-family: Kyobo-handwriting;
  font-size: ${24 * rsFont + 'px'};
  color: ${palette.neutral[900]};
  text-align: center;
  //background-color: red;
  line-height: ${Math.round(24 * rsFont * 1.3)}px; /* 글자 크기의 1.3배 정도 */
  //height: ${rsHeight * 70 + 'px'};
  padding: ${rsHeight * 8 + 'px'} 0 ${rsHeight * 8 + 'px'} 0;
`;
//전체 화면
export const Container = styled.View`
  background-color: ${palette.neutral[50]};
`;

//통계 컴포넌트를 감싸는 전체 컨테이너
export const ItemContainer = styled.View`
  flex: 1;
  gap: ${rsHeight * 30 + 'px'};
  padding-horizontal: ${rsWidth * 20 + 'px'};
  background-color: ${palette.neutral[50]};
`;

//---//

//변경된 색션 제목 폰트
export const SectionTitle = styled.Text`
  font-family: Kyobo-handwriting;
  font-size: ${18 * rsFont + 'px'};
  color: ${palette.neutral[900]};
  //background-color: white;
  width: auto;
`;

export const PageHintText = styled.Text`
  font-family: Pretendard-Regular;
  font-size: ${16 * rsFont + 'px'};
  color: black;
  margin: 0 ${rsWidth * 24 + 'px'} 0 ${rsWidth * 24 + 'px'};
`;
