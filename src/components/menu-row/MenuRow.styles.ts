import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const MenuRowContainer = styled.TouchableOpacity<{ showEventIcon?: boolean }>`
  width: 100%;
  padding-horizontal: ${rsWidth * 20 + 'px'};
  padding-vertical: ${rsHeight * 16 + 'px'};
  flex-direction: row;
  justify-content: ${(props) => (props.showEventIcon === true ? 'center' : 'space-between')};
  //justify-content: space-between;W
  align-items: center;
  //background-color: green;
`;

export const MenuRowTextContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: start;
  //background-color: yellow;
`;

export const MenuRowText = styled.Text`
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-Medium;
  color: ${palette.neutral[500]};
  //background-color: red;
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
