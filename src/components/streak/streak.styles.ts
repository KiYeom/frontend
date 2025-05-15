import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const Card = styled.View`
  display: flex;
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${rsHeight * 10 + 'px'} ${rsWidth * 10 + 'px'};
  border-radius: ${rsHeight * 10 + 'px'};
  border: 1px solid ${palette.neutral[200]};
  background-color: white;
  gap: 6px;
`;

export const IconContainer = styled.View`
  width: 45px;
  height: 45px;
  border-radius: 24px;
  background-color: transparent;
  justify-content: center;
  align-items: center;
`;

export const TextContainer = styled.View`
  flex: 1;
`;

export const ValueText = styled.Text<StyledProps>`
  font-size: 20px;
  font-family: Pretendard-SemiBold;
  color : ${palette.neutral[500]}
  margin-bottom: 4px;
`;

export const LabelText = styled.Text<StyledProps>`
  font-size: 14px;
  color: ${palette.neutral[300]};
  font-family: Pretendard-SemiBold;
`;
