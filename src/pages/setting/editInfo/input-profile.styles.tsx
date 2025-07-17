import styled from '@emotion/native';
import palette from '../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../utils/responsive-size';

export const Label = styled.Text`
  font-size: ${rsFont * 16 + 'px'};
  color: ${palette.neutral[500]};
  font-family: Pretendard-SemiBold;
`;

export const FormContainer = styled.View`
  display: flex;
  flex-direction: column;
  gap: ${rsHeight * 8 + 'px'};
`;

export const ButtonGroup = styled.View`
  display: flex;
  flex-direction: row;
  gap: ${rsWidth * 20 + 'px'};
  height: ${rsHeight * 52 + 'px'};
  justify-content: space-between;
  flex: 1;
`;

export const GenderButton = styled.TouchableOpacity<{ selected: boolean }>`
  flex: 1;
  height: ${rsHeight * 52 + 'px'};
  background-color: ${(props) => (props.selected ? palette.primary[50] : palette.neutral[100])};
  justify-content: center;
  align-items: center;
  border-radius: 10px;
`;

export const BtnLabel = styled.Text<{ selected: boolean }>`
  color: ${(props) => (props.selected ? palette.primary[500] : palette.neutral[500])};
  font-size: ${rsFont * 16 + 'px'};
  font-family: Pretendard-SemiBold;
`;
