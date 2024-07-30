import { TextInput, View, Text, TextStyle, StyleProp } from 'react-native';
import { IconContainer, InputContainer, InputField, WithMessage } from './input.styles';
import Icon, { TIconName } from '../icons/icons';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';

type InputProps = {
  status?: 'correct' | 'error' | 'default' | 'disabled';
  withMessage?: boolean;
  message?: string;
  value?: string;
  onChange?: (text: string) => void;
  placeholder?: string;
  textAlign?: 'left' | 'center' | 'right';
  showRightIcon?: boolean;
  rightIcon?: TIconName;
  onPress?: () => void;
  styles?: {
    text?: StyleProp<TextStyle>;
  };
};
const Input = (props: InputProps) => {
  const {
    status = 'default', //입력 필드 상태값
    withMessage = false, //메세지 표시 여부
    showRightIcon = false, //오른쪽에 표시되는 아이콘 여부
    rightIcon = 'arrow-down', //표시된다면 보일 아이콘
    message, //입력 필드 아래에 나타나는 메세지값
    value, //입력 필드의 값
    onChange = () => {}, //입력 필드의 값이 변경될 때 호출될 함수
    placeholder, //입력 필드에 표시될 플레이스 홀더 텍스트
    textAlign = 'left', //텍스트는 왼쪽부터 보임
    onPress, //컨테이너가 눌렸을 때
    styles, //적용될 스타일
  } = props; //props 객체를 변수로 선언하여 기본값 설정
  return (
    <InputContainer onPress={onPress}>
      <InputField
        placeholder={placeholder}
        status={status}
        value={value}
        onChangeText={onChange}
        editable={status !== 'disabled'}
        style={styles?.text}
      />
      {showRightIcon && (
        <IconContainer>
          <Icon
            name={rightIcon}
            width={rsWidth * 16}
            height={rsHeight * 16}
            color={palette.neutral[500]}
          />
        </IconContainer>
      )}
      {withMessage && (
        <WithMessage status={status} textAlign={textAlign}>
          {message}
        </WithMessage>
      )}
    </InputContainer>
  );
};

export default Input;
