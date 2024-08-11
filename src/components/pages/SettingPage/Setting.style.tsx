import styled from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
import { EdgeInsets } from 'react-native-safe-area-context';

export const SettingContainer = styled.ScrollView`
  flex: 1;
  width: 100%;
  height: 100%;
  padding-bottom: ${rsHeight * 40 + 'px'};
`;

export const UserInfoContainer = styled.TouchableOpacity<{ insets: EdgeInsets }>`
  width: 100%;
  height: auto;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: ${rsWidth * 10 + 'px'};
  padding-top: ${({ insets }) => insets.top + rsHeight * 32 + 'px'};
  padding-bottom: ${rsHeight * 32 + 'px'};
  padding-left: ${({ insets }) => insets.left + rsWidth * 20 + 'px'};
  padding-right: ${({ insets }) => insets.right + rsWidth * 20 + 'px'};
`;

export const ProfileImage = styled.Image`
  width: ${rsWidth * 60 + 'px'};
  height: ${rsHeight * 60 + 'px'};
  object-fit: contain;
`;

export const UserNickname = styled.Text`
  font-size: ${rsFont * 24 + 'px'};
  font-family: Pretendard-Medium;
`;

export const AppSettingContainer = styled.View`
  width: 100%;
  height: auto;
  padding-vertical: ${rsHeight * 20 + 'px'};
  border-top-color: ${palette.neutral[50]};
  border-top-width: ${rsHeight * 5 + 'px'};
`;

export const UserSettingContainer = styled.View`
  width: 100%;
  height: auto;
  padding-vertical: ${rsHeight * 20 + 'px'};
  border-top-color: ${palette.neutral[50]};
  border-top-width: ${rsHeight * 1 + 'px'};
`;

export const SubjectTextContainer = styled.View`
  width: 100%;
  height: auto;
  padding-horizontal: ${rsWidth * 20 + 'px'};
`;

export const SubjectText = styled.Text`
  font-size: ${rsFont * 12 + 'px'};
  font-family: Pretendard-Medium;
  color: ${palette.primary[500]};
  line-height: ${rsHeight * 20 + 'px'};
`;
