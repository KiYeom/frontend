import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const PhotoCardContainer = styled.View`
  position: relative;
  align-items: center;
`;
export const PhotoCardTextContainer = styled.View`
  width: 292px;
  height: 148px;
  background-color: rgba(255, 255, 255, 0.35);
  position: absolute;
  border-radius: 20px;
  align-items: center;
  padding-vertical: ${rsHeight * 5 + 'px'};
  padding-horizontal: ${rsWidth * 5 + 'px'};
  top: 53px;
  justify-content: center;
  padding-horizontal: ${rsWidth * 5 + 'px'};
  padding-vertical: ${rsHeight * 5 + 'px'};
`;

export const PhotoCardLyric = styled.Text`
  font-size: ${rsFont * 15 + 'px'};
  font-family: Pretendard-Regular;
  color: ${palette.neutral[900]};
`;

export const PhotoCardInfo = styled.Text`
  font-size: ${rsFont * 11 + 'px'};
  font-family: Pretendard-Regular;
  color: ${palette.neutral[900]};
`;
