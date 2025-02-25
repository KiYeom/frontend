import React from 'react';
import { TextInput } from 'react-native';
import { rsFont, rsHeight } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';

type CustomMultiTextInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
};

const MaximizedTextLine = 5;

//
const CustomMultiTextInput = (props: CustomMultiTextInputProps) => {
  const { value, onChangeText = () => {} } = props;
  return (
    <TextInput
      style={{
        flex: 1,
        fontSize: rsFont * 16,
        lineHeight: rsFont * 16 * 1.5,
        minHeight: rsFont * 16 * 1.5 + 15 * 2,
        maxHeight: rsFont * 16 * 1.5 * MaximizedTextLine + 15 * 2,
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: palette.neutral[50],
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
