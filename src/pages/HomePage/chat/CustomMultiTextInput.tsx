import React from 'react';
import { TextInput, View, TouchableOpacity } from 'react-native';
import { rsFont, rsHeight } from '../../../utils/responsive-size';
import palette from '../../../assets/styles/theme';
import Icon from '../../../components/icons/icons';

type CustomMultiTextInputProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  inputHeight?: number;
  setInputHeight?: (value: number) => void;
  textInputRef?: React.RefObject<TextInput>;
  iconName?: string;
  iconPosition?: 'left' | 'right';
  onEmojiPress?: () => void; // 이모티콘 버튼 클릭 핸들러 추가
  isEmojiPanelVisible?: boolean; // 이모티콘 패널 표시 상태
};

const MaximizedTextLine = 5;

const CustomMultiTextInput = (props: CustomMultiTextInputProps) => {
  const {
    value,
    onChangeText = () => {},
    inputHeight,
    setInputHeight = () => {},
    textInputRef,
    iconName,
    iconPosition = 'right',
    onEmojiPress,
    isEmojiPanelVisible = false,
  } = props;

  const handleContentSizeChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    setInputHeight(height < rsFont * 16 * 1.5 + 15 * 2 ? rsFont * 16 * 1.5 + 15 * 2 : height);
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginHorizontal: 10,
        backgroundColor: palette.neutral[50],
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 15,
        minHeight: rsFont * 16 * 1.5 + 15 * 2,
        flex: 1,
      }}>
      <TextInput
        style={{
          flex: 1,
          fontSize: rsFont * 16,
          lineHeight: rsFont * 16 * 1.5,
          maxHeight: rsFont * 16 * 1.5 * MaximizedTextLine,
          padding: 0,
          margin: 0,
          textAlignVertical: 'top',
        }}
        multiline
        ref={textInputRef}
        value={value}
        onChangeText={onChangeText}
        placeholder="메시지 입력"
        placeholderTextColor={palette.neutral[300]}
        onContentSizeChange={handleContentSizeChange}
      />
      <TouchableOpacity
        style={{
          paddingLeft: 10,
          marginRight: 0,
          justifyContent: 'center',
          minWidth: 24,
          height: 24,
        }}
        onPress={onEmojiPress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
        <Icon
          name={'emojiIcon'}
          width={24}
          color={isEmojiPanelVisible ? palette.primary[500] : palette.neutral[400]}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CustomMultiTextInput;
