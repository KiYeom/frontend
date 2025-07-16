import styled from '@emotion/native';
import { EdgeInsets } from 'react-native-safe-area-context';
import palette from '../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const HeaderContainer = styled.View<{
  isTitle: boolean;
  insets: EdgeInsets;
  bgcolor: string;
  isDark?: boolean;
}>`
  margin-top: ${(props) => props.insets.top + 'px'};
  height: ${rsHeight * 56 + 'px'};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;

  border-color: ${(props) => (props.isDark ? palette.dark : palette.neutral[100])};
  border-bottom-width: ${(props) => (props.isTitle ? `${rsHeight * 1 + 'px'} ` : `0px`)};
  //background-color: ${(props) => props.bgcolor};
  background-color: ${(props) =>
    props.isDark ? palette.dark : props.bgcolor ? props.bgcolor : palette.neutral[50]};
  z-index: 1000;
`;

export const HeaderLeft = styled.TouchableOpacity<{ isTitle: boolean }>`
  position: absolute;
  left: 0px;
  padding-left: ${(props) =>
    props.isTitle === undefined ? rsWidth * 24 + 'px' : rsWidth * 20 + 'px'};
  padding-right: ${rsWidth * 16 + 'px'};
  height: 75%;
  align-items: center;
  justify-content: left;
  flex-direction: row;
  gap: ${rsWidth * 4 + 'px'};
`;

export const HeaderRight = styled.TouchableOpacity<{ isTitle: boolean }>`
  position: absolute;
  right: 0px;
  margin-right: ${(props) =>
    props.isTitle === undefined ? rsWidth * 24 + 'px' : rsWidth * 20 + 'px'};

  align-items: center;
  justify-content: right;
  flex-direction: row;
  gap: ${rsWidth * 4 + 'px'};
`;

export const HeaderEvent = styled.TouchableOpacity<{ isTitle: boolean }>`
  position: absolute;
  right: 35px;
  margin-right: ${rsWidth * 13 + 'px'};
  padding-left: ${rsWidth * 10 + 'px'};
  padding-right: ${rsWidth * 10 + 'px'};
  height: 75%;
  align-items: center;
  justify-content: left;
  flex-direction: row;
  gap: ${rsWidth * 4 + 'px'};
  //background-color: black;
`;

export const HeaderCenter = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const HeaderTitle = styled.Text<{ isDark?: boolean }>`
  text-align: center;
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-SemiBold;
  width: flex;
  max-width: ${rsWidth * 200 + 'px'};
  color: ${(props) => (props.isDark ? palette.neutral[50] : palette.neutral[900])};
`;

export const OptionText = styled.Text`
  font-size: ${rsFont * 16 + 'px'};
  font-family: Pretendard-Regular;
  text-align: center;
  color: ${palette.neutral[900]};
`;
