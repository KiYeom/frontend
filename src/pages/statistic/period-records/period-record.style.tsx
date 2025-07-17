import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import { Image, ImageProps } from 'react-native';

export const RContainer = styled.View`
  gap: ${12 * rsHeight + 'px'};
  //padding-horizontal: ${rsWidth * 20 + 'px'};
  //background-color: red;
  flex-direction: column;
  width: ${rsWidth * 350 + 'px'};
`;

//키워드 흰색 컨테이너
export const RecordContainer = styled.TouchableOpacity`
  display: flex;
  align-items: start;
  justify-content: flex-start;
  padding-horizontal: ${rsWidth * 12 + 'px'};
  padding-vertical: ${rsHeight * 12 + 'px'};
  gap: ${rsWidth * 8 + 'px'};
  width: 100%;
  height: auto;
  overflow: hidden; //clip content
  box-sizing: border-box;
  background-color: white;
  border-radius: 10px;
`;

export const RecordDateArea = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  gap: ${rsWidth * 8 + 'px'};
`;

export const RecordDateText = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${16 * rsFont + 'px'};
  align-self: center;
`;

export const RecordDateIcon = styled.View`
  align-items: center;
  justify-content: center;
`;

export const RecordKeywordText = styled.Text`
  font-family: Pretendard-Bold;
  font-size: ${14 * rsFont + 'px'};
`;

export const RecordDailyText = styled.Text`
  font-family: Pretendard-Regular;
  font-size: ${14 * rsFont + 'px'};
`;

//키워드 제목
export const RecordTitle = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${18 * rsFont + 'px'};
  color: ${palette.neutral[900]};
`;

//키워드에 대한 설명
export const RecordText = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${16 * rsFont + 'px'};
  color: ${palette.neutral[900]};
`;

export const RTitle = styled.Text`
  font-family: Pretendard-SemiBold;
  font-size: ${18 * rsFont + 'px'};
  color: ${palette.neutral[900]};
`;
