import styled from '@emotion/native';
import { rsFont, rsWidth, rsHeight } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';

//제목
export const Title = styled.Text`
  font-family: Pretendard-Bold;
  font-size: ${rsFont * 20 + 'px'};
  color: ${palette.neutral[900]};
  text-align: center;
  background-color: pink;
`;

//설명글
export const Desc = styled.Text`
  font-family: Pretendard-Regular;
  font-size: ${rsFont * 20 + 'px'};
  color: ${palette.neutral[500]};
  text-align: center;
  background-color: yellow;
`;

//감정 선택란
export const EmotionLevel = styled.View`
  background-color: gray;
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;

//대감정
export const LargeEmotionComponent = styled.TouchableOpacity`
  background-color: ${palette.primary[500]};
  height: ${rsHeight * 50 + 'px'};
  width: ${rsWidth * 150 + 'px'};
  border-radius: 10px;
`;

//기록한 감정
export const RecordedEmotion = styled.ScrollView`
  flex-direction: row;
  background-color: purple;
`;
