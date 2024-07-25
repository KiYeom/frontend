import React from 'react';
import { TextInput } from 'react-native-paper';
import { View, Text } from 'react-native';
//설정 - 프로필 수정 화면에서 이름을 입력하는 창
const NameInput: React.FC<any> = () => {
  const [text, setText] = React.useState('');
  return (
    <View>
      <Text>닉네임</Text>
      <TextInput label="hi" value={text} onChangeText={text => setText(text)} maxLength={15} />
      <Text>{text.length}/15</Text>
    </View>
  );
};
export default NameInput;
