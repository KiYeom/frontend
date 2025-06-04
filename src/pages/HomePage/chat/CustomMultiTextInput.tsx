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
  iconName?: string; // 아이콘 이름 추가
  iconPosition?: 'left' | 'right'; // 아이콘 위치 추가
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
    iconPosition = 'right', // 기본값: 오른쪽
  } = props;

  const handleContentSizeChange = (event) => {
    const { height } = event.nativeEvent.contentSize;
    setInputHeight(height < rsFont * 16 * 1.5 + 15 * 2 ? rsFont * 16 * 1.5 + 15 * 2 : height);
  };

  const iconSize = rsFont * 20; // 아이콘 크기

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end', // 하단 정렬로 변경
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
          flex: 1, // flex 추가하여 남은 공간 차지
          fontSize: rsFont * 16,
          lineHeight: rsFont * 16 * 1.5,
          maxHeight: rsFont * 16 * 1.5 * MaximizedTextLine,
          padding: 0, // 기본 패딩 제거
          margin: 0, // 기본 마진 제거
          textAlignVertical: 'top', // 안드로이드에서 텍스트 상단 정렬
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
          //backgroundColor: 'pink',
          // alignSelf 제거하여 부모의 alignItems를 따름
          justifyContent: 'center',
          minWidth: 24,
          height: 24, // 고정 높이 설정
        }}>
        <Icon name={'emojiIcon'} width={24} color={palette.neutral[400]} />
      </TouchableOpacity>
    </View>
  );
};

export default CustomMultiTextInput;
