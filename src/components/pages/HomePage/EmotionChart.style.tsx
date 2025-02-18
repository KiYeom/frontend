import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

//제목
export const Title = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${rsFont * 24 + 'px'};
  color: ${palette.neutral[500]};
  text-align: center;
`;

//소제목
export const SmallTitle = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${rsFont * 20 + 'px'};
  color: ${palette.neutral[900]};
  text-align: left;
`;

export const AlertMessage = styled.Text`
  font-size: ${rsFont * 15 + 'px'};
  font-family: Pretendard-SemiBold;
  color: ${palette.neutral[500]};
`;

//아래 설명 글
export const Desc = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${rsFont * 24 + 'px'};
  color: ${palette.neutral[500]};
  text-align: center;
  background-color: yellow;
`;

//감정 선택란
export const EmotionLevel = styled.View`
  padding-top: ${rsHeight * 40 + 'px'};
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
  justify-content: center;
  align-items: center;
`;

//전체 화면
export const Container = styled.View`
  flex: 1;
  //background-color: pink;
`;

//기록한 감정
export const RecordedEmotion = styled.ScrollView`
  flex-direction: row;
`;

//감정 설명 창
export const EmotionDesc = styled.Text<{
  textAlign?: 'left' | 'center' | 'right';
}>`
  font-size: ${rsFont * 14 + 'px'};
  font-family: Pretendard-Medisum;
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
  color: ${palette.neutral[400]};
`;
