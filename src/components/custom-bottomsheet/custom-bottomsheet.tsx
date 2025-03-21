import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Keyboard, KeyboardEvent } from 'react-native';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { css } from '@emotion/native';
import { rsWidth } from '../../utils/responsive-size';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EmotionIcon } from '../../components/emotionIcon/emotionIcon';
import Button from '../../components/button/button';

interface BottomSheetProps {
  indexNumber?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (text: string) => void;
  // 추가적인 props 가 필요하면 여기서 정의
}

const CustomBottomSheet: React.FC<BottomSheetProps> = (props) => {
  const { indexNumber, isOpen = false, onClose = () => {}, onSubmit = () => {} } = props;
  const [index, setIndex] = useState<number>(indexNumber);
  // callbacks
  // 닫힐 때는 index -1 , 열릴 때는 index 0
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, []);
  // 키보드 높이 관리
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleClosePress = () => bottomSheetRef.current.close();
  const insets = useSafeAreaInsets();

  // 키보드 등장 시 높이 저장
  const handleKeyboardDidShow = useCallback((e: KeyboardEvent) => {
    setKeyboardHeight(e.endCoordinates.height);
  }, []);

  // 키보드 숨김 시 높이 초기화
  const handleKeyboardDidHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [handleKeyboardDidShow, handleKeyboardDidHide]);

  const snapPoints = ['25%'];

  useEffect(() => {
    if (!bottomSheetRef.current) return;
    if (indexNumber === -1) {
      bottomSheetRef.current.close();
    } else {
      bottomSheetRef.current.snapToIndex(indexNumber);
    }
  }, [indexNumber]);

  // 버튼 클릭 가능 여부
  const validateButton = (text: string): boolean => {
    return text.length === 0 || text.length > 10;
  };

  // 감정 아이콘 클릭 이벤트
  const handleEmotionPress = (emotion: string) => {
    console.log(`${emotion} icon click`);
    // 감정 선택 시 추가 로직 구현 가능
  };
  //console.log('custom-bottomsheet', bottomSheetRef);

  //원하는 인덱스로 이동하는 핸들러
  const handlePress = (index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  };
  return (
    <BottomSheet
      ref={bottomSheetRef}
      // 필요에 따라 snapPoints 설정 가능 (예: ['25%', '80%'])
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      index={index}
      enablePanDownToClose={true}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore">
      <BottomSheetView
        style={css`
          flex: 1;
          align-items: center;
          background-color: red;
          padding-bottom: ${insets.bottom}px;
          padding-horizontal: ${rsWidth * 20}px;
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
          <EmotionIcon status="happy" size={50} onPress={() => handleEmotionPress('happy')} />
          <EmotionIcon status="angry" size={50} onPress={() => handleEmotionPress('angry')} />
          <EmotionIcon status="sad" size={50} onPress={() => handleEmotionPress('sad')} />
          <EmotionIcon status="calm" size={50} onPress={() => handleEmotionPress('calm')} />
          <EmotionIcon status="normal" size={50} onPress={() => handleEmotionPress('normal')} />
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
            onChangeText={setText}
            style={css`
              width: 100%;
              align-items: center;
              background-color: blue;
              margin-top: 16px;
            `}
          />
          <Text>text : {text}</Text>
        </View>
        <Button
          title="나의 감정 기록하기"
          primary={true}
          disabled={validateButton(text)}
          onPress={() => {
            console.log('나의 감정 기록하기');
            handleClosePress();
            //키보드 내리기
            Keyboard.dismiss();
          }}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;
