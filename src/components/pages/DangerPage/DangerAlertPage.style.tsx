import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const Container = styled.View`
  flex: 1;
  background-color: pink;
  justify-content: center;
  align-items: center;
  padding-vertical: ${rsHeight * 20 + 'px'};
  padding-horizontal: ${rsWidth * 20 + 'px'};
  gap: ${rsHeight * 20 + 'px'};
`;

export const Title = styled.Text`
  font-family: Pretendard-Black;
  font-size: ${rsFont * 24 + 'px'};
  color: ${palette.neutral[500]};
  text-align: center;
  letter-spacing: ${rsWidth * -0.41 + 'px'};
  background-color: yellow;
`;

export const ImageContainer = styled.View`
  flex: 1;
  width: 100%;
  justify-content: center;
  align-items: center;
  background-color: blue;
`;

export const Desc = styled.Text`
  font-family: Pretendard-Regular;
  font-size: ${rsFont * 17 + 'px'};
  color: ${palette.neutral[500]};
  text-align: center;
`;

export const BtnContainer = styled.View`
  padding-vertical: ${rsHeight * 10 + 'px'};
  gap: ${rsHeight * 10 + 'px'};
  flex-direction: column;
  background-color: yellow;
  width: 100%;
`;
