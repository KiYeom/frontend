import React from 'react';
import { TextInput } from 'react-native';
import { rsFont, rsHeight } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';

type CustomMultiTextInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
};

//
const CustomMultiTextInput = (props: CustomTextInputProps) => {
  const { value, onChangeText = () => {} } = props;
  return (
    <TextInput
      style={{
        flex: 1,
        fontSize: rsFont * 16,
        lineHeight: rsFont * 16 * 1.4,
        minHeight: rsHeight * 46,
        maxHeight: rsHeight * 110,
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
      }}
      multiline
      value={value}
      onChangeText={onChangeText}
      placeholder="메시지 입력"
      placeholderTextColor={palette.neutral[300]}
    />
  );
};

export default CustomMultiTextInput;
