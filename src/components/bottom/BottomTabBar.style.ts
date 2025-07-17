import styled from '@emotion/native';
import { EdgeInsets } from 'react-native-safe-area-context';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
import { Platform } from 'react-native';

export const BottomTabBarContainer = styled.View<{ insets: EdgeInsets }>`
  width: 100%;
  height: 70px;
  margin-bottom: ${(props) =>
    Platform.OS === 'ios' && props.insets.bottom > 0
      ? props.insets.bottom / 2 + 'px'
      : props.insets.bottom + 'px'};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-color: #ddd;
  padding-horizontal: ${rsWidth * 30 + 'px'};
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
