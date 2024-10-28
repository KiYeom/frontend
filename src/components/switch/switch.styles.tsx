import styled, { css } from '@emotion/native';
import { ratio, rsHeight, rsWidth } from '../../utils/responsive-size';

export const SwitchContainer = styled.TouchableOpacity<{ color: string }>`
  width: ${rsWidth * 42 + 'px'};
  height: ${rsHeight * 24 + 'px'};
  padding-horizontal: ${rsWidth * 2 + 'px'};
  padding-vertical: ${rsHeight * 2 + 'px'};
  border-radius: ${ratio * 18 + 'px'};
  justify-content: center;
  background-color: ${(props) => props.color};
`;

export const animatedViewStyle = css`
  width: ${rsWidth * 20 + 'px'};
  height: ${rsHeight * 20 + 'px'};
  background-color: white;
  border-radius: ${ratio * 100 + 'px'};
`;
