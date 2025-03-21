import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { rsFont, rsHeight } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
import { View, TouchableOpacity } from 'react-native';
import Icon from '../../../components/icons/icons';

type CustomMultiTextInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  isShownEmoji: boolean;
  setIsShownEmoji: (value: boolean) => void;
  inputHeight: number;
  setInputHeight: (value: number) => void;
};

const MaximizedTextLine = 5;

//
const CustomMultiTextInput = (props: CustomMultiTextInputProps) => {
  const {
    value,
    onChangeText = () => {},
    isShownEmoji,
    setIsShownEmoji = () => {},
    inputHeight,
    setInputHeight = () => {},
  } = props;
  //const [inputHeight, setInputHeight] = useState(rsFont * 16 * 1.5 + 15 * 2);
  const handleContentSizeChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    setInputHeight(height < rsFont * 16 * 1.5 + 15 * 2 ? rsFont * 16 * 1.5 + 15 * 2 : height);
    // 최소 높이보다 작으면 최소 높이, 그렇지 않으면 변경된 높이 사용
    console.log('입력 필드 높이:', height);
  };
  return (
    <View style={{ flex: 1, position: 'relative', backgroundColor: 'pink' }}>
      <TextInput
        style={{
          // flex: 1, // 제거하거나 TextInput이 자동으로 높이가 조절되도록 함
          fontSize: rsFont * 16,
          lineHeight: rsFont * 16 * 1.5,
          minHeight: rsFont * 16 * 1.5 + 15 * 2,
          maxHeight: rsFont * 16 * 1.5 * MaximizedTextLine + 15 * 2,
          borderRadius: 10,
          paddingHorizontal: 15,
          paddingVertical: 15,
          paddingRight: 40, // 아이콘 공간 확보를 위한 오른쪽 여백
          backgroundColor: palette.neutral[50],
          textAlignVertical: 'top', // Android에서 상단 정렬
        }}
        multiline
        value={value}
        onChangeText={onChangeText}
        placeholder="메시지 입력"
        placeholderTextColor={palette.neutral[300]}
        onContentSizeChange={handleContentSizeChange}
      />
      <TouchableOpacity
        style={{
          position: 'absolute',
          right: 15,
          bottom: 15,
        }}
        onPress={() => {
          console.log('emoji');
          setIsShownEmoji(!isShownEmoji);
        }}>
        <Icon
          name="emoji"
          width={rsFont * 20}
          height={rsFont * 20}
          color={isShownEmoji ? palette.neutral[400] : palette.neutral[300]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CustomMultiTextInput;
