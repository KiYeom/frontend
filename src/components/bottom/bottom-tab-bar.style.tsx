import styled from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
import { EdgeInsets } from 'react-native-safe-area-context';

export const BottomTabBarCotainer = styled.View<{ insets: EdgeInsets }>`
  display: flex;
  height: ${rsHeight * 90 + 'px'};
  padding-horizontal: ${rsWidth * 60 + 'px'};
  padding-vertical: ${rsHeight * 16 + 'px'};
  flex-direction: row;
  justify-content: space-between;
  align-items: top;
  border-color: #ddd;
`;

export const TabButtonContainer = styled.TouchableOpacity`
  width: auto;
  height: ${rsHeight * 50 + 'px'};
  flex-direction: column;
  justify-content: space-between;
`;

export const TabLabel = styled.Text<{ isFocused: boolean }>`
  font-size: ${13 * rsFont + 'px'};
  font-family: Pretendard-Medium;
  width: 100%;
  text-align: center;
  color: ${(props) => (props.isFocused ? palette.primary[500] : palette.neutral[300])};
`;
