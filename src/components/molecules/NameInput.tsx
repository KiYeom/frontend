import React from 'react';
import { TextInput } from 'react-native-paper';
import { View, Text } from 'react-native';
import palette from '../../assets/styles/theme';
import Input from '../input/input';
import { USER } from '../../constants/Constants';
import { Label } from '../pages/sign-up/input-profile/input-profile.styles';
import { FormContainer } from '../pages/sign-up/input-profile/input-profile.styles';
//설정 - 프로필 수정 화면에서 이름을 입력하는 창

interface NameInputProps {
  name: string;
  setName: (name: string) => void;
}

//validateName 함수
//매개변수로 전달된 문자열 (name)의 길이에 따라 error, default, correct 값을 반환한다.
const validateName = (name: string): 'error' | 'default' | 'correct' => {
  if (name.length !== 0 && (name.length < 2 || name.length > 15)) return 'error';
  else if (name.length >= 2 && name.length <= 15) return 'correct';
  else return 'default';
};

const NameInput: React.FC<NameInputProps> = ({ name, setName }) => {
  const [text, setText] = React.useState(name);
  return (
    <FormContainer>
      <Label>닉네임</Label>
      <Input
        placeholder="이름"
        status={validateName(text)}
        message="2~15 글자 사이의 이름을 지어주세요!"
        withMessage={true}
        onChange={(text) => {
          if (text.length <= 15) setText(text);
        }}
        value={text}
      />
    </FormContainer>
  );
};
export default NameInput;
