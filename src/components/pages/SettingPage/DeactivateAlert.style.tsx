import palette from '../../../assets/styles/theme';
import styled from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  padding-horizontal: ${rsWidth * 20 + 'px'};
  padding-vertical: ${rsHeight * 40 + 'px'};
  gap: ${rsHeight * 20 + 'px'};
`;

export const SignOutTitleContainer = styled.View`
  align-items: center;
  background-color: yellow;
`;

export const SignOutTitle = styled.Text<{ status: 'default' | 'number' }>`
  font-size: ${rsFont * 28 + 'px'};
  color: ${(props) => (props.status === 'default' ? palette.neutral[900] : palette.primary[500])};
  font-family: Pretendard-SemiBold;
  align-self: flex-start;
  line-height: ${rsHeight * 28 * 1.2 + 'px'};
`;

export const ImageContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const AlertText = styled.Text`
  font-size: ${rsFont * 14 + 'px'};
  color: ${palette.neutral[300]};
  text-align: center;
`;
