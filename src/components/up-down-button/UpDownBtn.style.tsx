import styled from '@emotion/native';
import { EdgeInsets } from 'react-native-safe-area-context';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const UpDownContainer = styled.View`
  background-color: blue;
  height: ${rsHeight * 44 + 'px'};
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  align-items: center;
  padding-horizontal: ${rsWidth * 20 + 'px'};
`;

export const ScrollBtnContainer = styled.TouchableOpacity<{ enable: boolean }>`
  width: ${rsWidth * 24 + 'px'};
  height: ${rsHeight * 24 + 'px'};
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.enable ? palette.neutral[300] : palette.neutral[50])};
  border-radius: ${rsHeight * 12 + 'px'};
  margin-left: ${rsWidth * 15 + 'px'};
`;
