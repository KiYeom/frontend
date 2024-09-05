import styled from '@emotion/native';
import { rsFont, rsWidth, rsHeight } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';

//제목
export const Title = styled.Text`
  font-family: Pretendard-Semibold;
  font-size: ${rsFont * 24 + 'px'};
  color: ${palette.neutral[500]};
  text-align: center;
`;

//제목 컨테이너
export const TitleContainer = styled.View`
  padding-top: ${rsHeight * 30 + 'px'};
`;

//아래 설명 글
export const Desc = styled.Text`
  font-family: Pretendard-Semibold;
  font-size: ${rsFont * 24 + 'px'};
  color: ${palette.neutral[500]};
  text-align: center;
  background-color: yellow;
`;

//감정 선택란
export const EmotionLevel = styled.View`
  padding-vertical: ${rsHeight * 20 + 'px'};
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

//대감정
export const LargeEmotionComponent = styled.TouchableOpacity<{ color: string }>`
  background-color: ${(props) => props.color};
  height: ${rsHeight * 50 + 'px'};
  width: ${rsWidth * 150 + 'px'};
  border-radius: 10px;
`;

//전체 화면
export const Container = styled.View`
  flex: 1;
  padding-vertical: ${rsHeight * 40 + 'px'};
  padding-horizontal: ${rsWidth * 24 + 'px'};
`;

/*
export const TabLabel = styled.Text<{ isFocused: boolean }>`
  font-size: ${13 * rsFont + 'px'};
  font-family: Pretendard-Medium;
  width: 100%;
  text-align: center;
  color: ${(props) => (props.isFocused ? palette.primary[500] : palette.neutral[300])};
`;
*/

//기록한 감정
export const RecordedEmotion = styled.ScrollView`
  flex-direction: row;
  background-color: purple;
`;
