import React from 'react';
import { TextInput } from 'react-native';
import { rsFont, rsHeight } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';

type CustomMultiTextInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  inputHeight?: number;
  setInputHeight?: (value: number) => void;
  textInputRef?: React.RefObject<TextInput>;
};

const MaximizedTextLine = 5;

//
const CustomMultiTextInput = (props: CustomMultiTextInputProps) => {
  const {
    value,
    onChangeText = () => {},
    inputHeight,
    setInputHeight = () => {},
    textInputRef,
  } = props;
  const handleContentSizeChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    setInputHeight(height < rsFont * 16 * 1.5 + 15 * 2 ? rsFont * 16 * 1.5 + 15 * 2 : height);
    // 최소 높이보다 작으면 최소 높이, 그렇지 않으면 변경된 높이 사용
    //console.log('입력 필드 높이:', height);
  };
  return (
    <TextInput
      style={{
        flex: 1,
        fontSize: rsFont * 16,
        lineHeight: rsFont * 16 * 1.5,
        minHeight: rsFont * 16 * 1.5 + 15 * 2,
        maxHeight: rsFont * 16 * 1.5 * MaximizedTextLine + 15 * 2,
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 15,
        backgroundColor: palette.neutral[50],
        marginHorizontal: 10,
      }}
      multiline
      ref={textInputRef}
      value={value}
      onChangeText={onChangeText}
      placeholder="메시지 입력"
      placeholderTextColor={palette.neutral[300]}
      onContentSizeChange={handleContentSizeChange}
    />
  );
};

export default CustomMultiTextInput;
