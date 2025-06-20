import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputContentSizeChangeEventData,
} from 'react-native';
import { rsHeight, rsWidth, rsFont } from '../../../../utils/responsive-size';
import useEmotionStore from '../../../../store/useEmotionStore';
import palette from '../../../../assets/styles/theme';
const TextInputSection = () => {
  const [textInputContainerHeight, setTextInputContainerHeight] = useState(200);
  const minInputHeight = 200;
  const diaryText = useEmotionStore((state) => state.diaryText);
  const setDiaryText = useEmotionStore((state) => state.setDiaryText);
  const lastContentSizeChange = useRef(Date.now());
  const throttleDelay = 100; // 100ms throttle

  const handleContentSizeChange = (
    event: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    const now = Date.now();
    if (now - lastContentSizeChange.current > throttleDelay) {
      lastContentSizeChange.current = now;
      const newHeight = event.nativeEvent.contentSize.height;
      if (Math.abs(newHeight - textInputContainerHeight) > 20) {
        setTextInputContainerHeight(Math.max(minInputHeight, newHeight));
      }
    }
  };
  return (
    <View
      style={{
        //backgroundColor: 'blue',
        flex: 1,
        marginHorizontal: rsWidth * 24,
        marginVertical: rsHeight * 5,
        minHeight: textInputContainerHeight,
        //padding: 10,
      }}>
      <TextInput
        multiline
        autoFocus
        scrollEnabled={true}
        value={diaryText}
        onChangeText={setDiaryText}
        placeholder="이 감정을 강하게 느낀 순간을 기록해보세요"
        placeholderTextColor="#B6BDC6"
        style={{
          backgroundColor: `${palette.neutral[50]}`,
          flex: 1,
          fontSize: rsFont * 16,
          lineHeight: rsFont * 16 * 1.5,
          padding: rsHeight * 12,
          textAlignVertical: 'top',
          fontFamily: 'Kyobo-handwriting',
          width: '100%',
          borderRadius: 10,
          paddingVertical: rsHeight * 12,
          paddingHorizontal: rsWidth * 16,
        }}
        onContentSizeChange={handleContentSizeChange}
      />
    </View>
  );
};
export default TextInputSection;
