import styled from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';

export const HeaderContainer = styled.View<{ isTitle: boolean }>`
  margin-top: ${rsHeight * 40 + 'px'};
  height: ${rsHeight * 56 + 'px'};
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  position: relative;

  border-color: ${palette.neutral[100]};
  border-bottom-width: ${(props) => (props.isTitle ? `${rsHeight * 1 + 'px'} ` : `none`)};
`;

export const HeaderLeft = styled.TouchableOpacity<{ isTitle: boolean }>`
  position: absolute;
  left: 0px;
  margin-left: ${(props) =>
    props.isTitle === undefined ? rsWidth * 24 + 'px' : rsWidth * 20 + 'px'};

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

export const HeaderCenter = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
`;

export const HeaderTitle = styled.Text`
  text-align: center;
  font-size: ${rsFont * 18 + 'px'};
  font-family: Pretendard-SemiBold;
  width: flex;
  max-width: ${rsWidth * 200 + 'px'};
`;

export const OptionText = styled.Text`
  font-size: ${rsFont * 16 + 'px'};
  font-family: Pretendard-Regular;
  text-align: center;
  color: ${palette.neutral[900]};
`;
