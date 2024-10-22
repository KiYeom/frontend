import styled from '@emotion/native';
import { EdgeInsets } from 'react-native-safe-area-context';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight } from '../../utils/responsive-size';

export const BottomTabBarContainer = styled.View<{ insets: EdgeInsets }>`
  width: 100%;
  height: ${rsHeight * 90 + 'px'};
  padding-bottom: ${rsHeight * 10 + 'px'};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-color: #ddd;
`;

export const TabButtonContainer = styled.TouchableOpacity`
  flex: 1;
  height: 100%;
  flex-direction: column;
  justify-content: center;
  gap: ${rsHeight * 8 + 'px'};
  align-items: center;
`;

export const TabLabel = styled.Text<{ isFocused: boolean }>`
  font-size: ${13 * rsFont + 'px'};
  font-family: Pretendard-Medium;
  width: 100%;
  text-align: center;
  color: ${(props) => (props.isFocused ? palette.primary[500] : palette.neutral[300])};
`;
