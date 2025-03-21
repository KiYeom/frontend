import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, Keyboard, KeyboardEvent, TouchableOpacity } from 'react-native';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { css } from '@emotion/native';
import Icon from '../../../components/icons/icons';
import Button from '../../../components/button/button';
import { rsWidth } from '../../../utils/responsive-size';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EmotionIcon } from '../../../components/emotionIcon/emotionIcon';

const ActionSheetScreen = () => {
  //<나의 감정 기록하기> 버튼 상태를 관리하는 함수
  const validateButton = (text: string): boolean => {
    if (text.length === 0 || text.length > 10) return true; //클릭 불가능
    return false; //클릭 가능
  };
  // Track keyboard height or visibility
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);

  //글자수 작성
  const [text, setText] = useState<string>('');

  // Refs
  const bottomSheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  // 키보드 상태에 따라 높이를 저장 (키보드가 보일 때)
  const handleKeyboardDidShow = useCallback((e: KeyboardEvent) => {
    setKeyboardHeight(e.endCoordinates.height);
  }, []);

  // 키보드 상태에 따라 높이를 저장 (키보드가 안 보일 때)
  const handleKeyboardDidHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);

  //컴포넌트가 마운트될 때 키보드가 나타나거나 사라지는 이벤트를 감지하기 위해 리스너 추가
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

    return () => {
      showSub.remove();
      hideSub.remove();
      //컴포넌트가 언마운트될 때 리스너를 제거하여 메모리 누수 방지
    };
  }, [handleKeyboardDidShow, handleKeyboardDidHide]);

  // Adjust snap points based on keyboard visibility
  /*const snapPoints = useMemo(() => {
    // If keyboard is up, give more room (80%). Otherwise 25%.
    return ['25%'];
  }, [keyboardHeight]);*/

  // Optional callback

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);

  return (
    <GestureHandlerRootView>
      <BottomSheet
        ref={bottomSheetRef}
        //snapPoints={snapPoints}
        onChange={handleSheetChanges}
        // Optionally configure how it reacts to the keyboard
        keyboardBehavior="interactive"
        keyboardBlurBehavior="restore">
        <BottomSheetView
          style={css`
            flex: 1;
            align-items: center;
            background-color: red;
            padding-bottom: ${insets.bottom + 'px'};
            padding-horizontal: ${rsWidth * 20 + 'px'};
          `}>
          <View style={{ backgroundColor: 'yellow' }}>
            <Text>나의 감정을 자유롭게 표현해보세요</Text>
          </View>

          <View
            style={css`
              background-color: green;
              flex-direction: row;
              justify-content: space-around;
              width: 100%;
            `}>
            <EmotionIcon
              status="happy"
              size={50}
              onPress={() => {
                console.log('happy icon click');
              }}
            />
            <EmotionIcon
              status="angry"
              size={50}
              onPress={() => {
                console.log('angry icon click');
              }}
            />
            <EmotionIcon
              status="sad"
              size={50}
              onPress={() => {
                console.log('sad icon click');
              }}
            />
            <EmotionIcon
              status="calm"
              size={50}
              onPress={() => {
                console.log('calm icon click');
              }}
            />
            <EmotionIcon
              status="normal"
              size={50}
              onPress={() => {
                console.log('normal icon click');
              }}
            />
          </View>

          <View
            style={css`
              background-color: pink;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              width: 100%;
            `}>
            <BottomSheetTextInput
              autoFocus
              placeholder="Click here…"
              value={text}
              onChangeText={(newText) => setText(newText)}
              style={css`
                width: 100%;
                align-items: center;
                background-color: blue;
                margin-top: 16px;
              `}
            />

            <Text>text : {text}</Text>
          </View>

          {/*<Text style={styles.status}>
            {keyboardHeight > 0 ? 'Keyboard Shown' : 'Keyboard Hidden'}
          </Text>*/}

          <Button title={'나의 감정 기록하기'} primary={true} disabled={validateButton(text)} />
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  status: {
    padding: 16,
    textAlign: 'center',
    color: '#fff',
  },
});

export default ActionSheetScreen;
