import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const SettingContainer = styled.ScrollView`
  flex: 1;
  width: 100%;
  height: 100%;
  padding-bottom: ${rsHeight * 40 + 'px'};
`;

export const UserInfoContainer = styled.TouchableOpacity`
  width: 100%;
  height: auto;
  flex-direction: row;
  align-items: center;
  justify-content: start;
  gap: ${rsWidth * 10 + 'px'};
  padding-top: ${rsHeight * 28 + 'px'};
  padding-bottom: ${rsHeight * 28 + 'px'};
  padding-left: ${rsWidth * 20 + 'px'};
  padding-right: ${rsWidth * 20 + 'px'};
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
