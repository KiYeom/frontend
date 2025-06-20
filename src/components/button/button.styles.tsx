import styled from '@emotion/native';
import palette from '../../assets/styles/theme';
import { rsHeight, rsWidth } from '../../utils/responsive-size';

export const ButtonContainer = styled.TouchableOpacity<{
  disabled?: boolean;
  primary?: boolean;
  icon?: string;
}>`
  display: flex;
  //flex: 1; //1.7.10 추가
  flex: 1;
  flex-direction: ${(props) => (props.icon ? 'row' : 'column')};
  align-items: center;
  justify-content: center;
  gap: ${rsWidth * 10 + 'px'};
  padding: 0 ${rsWidth * 16 + 'px'};
  height: ${rsHeight * 56 + 'px'};
  border-radius: ${rsWidth * 10 + 'px'};

  background-color: ${(props) =>
    props.disabled
      ? palette.neutral[100]
      : props.primary
        ? palette.primary[400]
        : palette.primary[50]};
`;

export const ButtonLabel = styled.Text<{ primary?: boolean; disabled?: boolean }>`
  color: ${(props) =>
    props.disabled ? palette.neutral[300] : props.primary ? 'white' : palette.primary[400]};
  font-size: ${rsWidth * 20 + 'px'};
  font-family: Pretendard-Bold;
  text-align: center;
`;
