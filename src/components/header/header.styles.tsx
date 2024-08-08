import styled from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';

export const HeaderContainer = styled.View`
  margin-top: ${rsHeight * 40 + 'px'};
  height: ${rsHeight * 56 + 'px'};
  padding-left: ${rsWidth * 24 + 'px'};
  padding-right: ${rsWidth * 24 + 'px'};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const LeftContainer = styled.TouchableOpacity`
  flex-direction: row;
`;

export const HeaderCenter = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const HeaderTitle = styled.Text`
  text-align: center;
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-SemiBold;
  width: ${rsWidth * 250 + 'px'};
`;
