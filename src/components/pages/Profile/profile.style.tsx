import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
export const Container = styled.View`
  flex: 1;
  //background-color: yellow;
  padding-horizontal: ${rsWidth * 20 + 'px'};
  padding-vertical: ${rsHeight * 20 + 'px'};
  gap: ${rsHeight * 15 + 'px'};
`;
export const ProfileTitleContainer = styled.View`
  width: ${rsWidth * 117 + 'px'};
  height: ${rsHeight * 39 + 'px'};
  background-color: ${palette.primary[400]};
  border-radius: 10px;
  justify-content: center;
  align-items: center;
`;
export const ProfileText = styled.Text<{ color: string }>`
  font-family: Pretendard-SemiBold;
  font-size: ${rsFont * 20 + 'px'};
  color: ${(props) => props.color};
`;

export const ProfileTitle = styled.Text`
  font-family: Pretendard-ExtraBold;
  font-size: ${rsFont * 30 + 'px'};
  color: ${palette.neutral[900]};
  text-align: center;
`;
export const ProfileDesc = styled.Text`
  font-family: Pretendard-Bold;
  font-size: ${rsFont * 24 + 'px'};
  color: ${palette.neutral[900]};
  text-align: center;
`;
