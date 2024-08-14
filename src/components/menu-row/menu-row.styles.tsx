import styled from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';

export const MenuRowContainer = styled.TouchableOpacity`
  width: 100%;
  padding-horizontal: ${rsWidth * 20 + 'px'};
  padding-vertical: ${rsHeight * 16 + 'px'};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const MenuRowTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: start;
`;

export const MenuRowText = styled.Text`
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-Medium;
  color: ${palette.neutral[500]};
`;

export const VersionText = styled.Text`
  font-size: ${rsFont * 14 + 'px'};
  font-family: Pretendard-Medium;
  color: ${palette.neutral[300]};
  line-height: ${rsHeight * 22 + 'px'};
  margin-left: ${rsWidth * 8 + 'px'};
`;

export const VersionStatus = styled.Text<{ isLatest: boolean }>`
  font-size: ${rsFont * 16 + 'px'};
  font-family: Pretendard-Medium;
  line-height: ${rsHeight * 22 + 'px'};
  margin-left: ${rsWidth * 4 + 'px'};

  color: ${({ isLatest }) => (isLatest ? palette.primary[500] : palette.function.error)};
`;

export const LargeTouchArea = styled.TouchableOpacity`
  width: auto;
  height: auto;
  padding-horizontal: ${rsWidth * 9 + 'px'};
  padding-vertical: ${rsHeight * 9 + 'px'};
  background-color: ${palette.neutral[900]};
`;
