import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsWidth, rsHeight, rsFont } from '../../utils/responsive-size';

export const MoodButtonContainer = styled.TouchableOpacity<{
  primary?: boolean;
  onPress?: () => void;
}>`
  padding-vertical: ${rsHeight * 10 + 'px'};
  padding-horizontal: ${rsWidth * 10 + 'px'};
  width: ${rsWidth * 48 + 'px'};
  height: ${rsHeight * 32 + 'px'};
  border-radius: 10px;
  background-color: ${(props) => (props.primary ? 'white' : 'transparent')};
  justify-content: center;
  align-items: center;
`;
export const MoodButtonLabel = styled.Text<{ primary?: boolean }>`
  font-family: Pretendard-SemiBold;
  font-size: ${rsFont * 12 + 'px'};
  color: ${(props) => (props.primary ? palette.neutral[900] : palette.neutral[300])};
  text-align: center;
`;
