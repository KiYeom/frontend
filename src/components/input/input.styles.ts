import styled from '@emotion/native';
import { rsFont, rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';

export const InputContainer = styled.TouchableOpacity`
  display: flex;
  flex-dircetion: column;
  gap: ${rsHeight * 4 + 'px'};
  position: relative;
`;

export const InputField = styled.TextInput<{
  status: 'default' | 'error' | 'correct' | 'disabled';
}>`
  border-radius: 10px;
  height: ${rsHeight * 52 + 'px'};
  padding: 0 ${rsHeight * 18 + 'px'};
  padding-right: ${(props) =>
    props.status !== 'disabled' ? rsWidth * 40 + 'px' : rsHeight * 18 + 'px'};

  background-color: ${palette.neutral[50]};
  font-size: ${rsFont * 16 + 'px'};
  font-family: Pretendard-Regular;
  color: ${(props) => (props.status === 'disabled' ? palette.neutral[200] : palette.neutral[900])};

  border: ${(props) =>
    props.status === 'error'
      ? `1px solid ${palette.function.error}`
      : props.status === 'correct'
        ? `1px solid ${palette.primary[400]}`
        : 'none'};
`;

export const WithMessage = styled.Text<{
  status: 'default' | 'error' | 'correct' | 'disabled';
  textAlign?: 'left' | 'center' | 'right';
}>`
  font-size: ${rsFont * 12 + 'px'};
  font-family: Pretendard-Regular;
  color: ${(props) =>
    props.status === 'error'
      ? palette.function.error
      : props.status === 'correct'
        ? palette.primary[400]
        : palette.neutral[300]};
  text-align: ${(props) => (props.textAlign ? props.textAlign : 'left')};
`;

export const IconContainer = styled.TouchableOpacity`
  position: absolute;
  right: ${rsWidth * 4 + 'px'};
  top: ${rsHeight * 4 + 'px'};
  width: ${rsWidth * 44 + 'px'};
  height: ${rsHeight * 44 + 'px'};
  justify-content: center;
  align-items: center;
  background-color: ${palette.neutral[50]};
`;
