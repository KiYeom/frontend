import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, Keyboard, KeyboardEvent } from 'react-native';
import BottomSheet, { BottomSheetTextInput, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { css } from '@emotion/native';
import { rsWidth } from '../../utils/responsive-size';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { EmotionIcon } from '../../components/emotionIcon/emotionIcon';
import { Emotion } from '../../store/emotion-status';
import Button from '../../components/button/button';
import { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import {
  IntroText,
  IntroContainer,
  EmotionIconContainer,
  BottomSheetTextInputContainer,
  StyledBottomSheetTextInput,
  ButtonContainer,
  TextLengthAlert,
} from './custom-bottomsheet.styles';
import useEmotionStore from '../../store/emotion-status';
import Analytics from '../../utils/analytics';

interface BottomSheetProps {
  indexNumber?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (text: string) => void;
  // 추가적인 props 가 필요하면 여기서 정의
}

const emotions = ['happy', 'angry', 'sad', 'calm', 'normal'];

const CustomBottomSheet: React.FC<BottomSheetProps> = (props) => {
  const { indexNumber, isOpen = false, onClose = () => {}, onSubmit = () => {} } = props;
  //감정 입력 상태를 저장하는 state : boolean 타입, 5개
  const [selectedStatus, setSelectedStatus] = useState<number>(-1);

  const [index, setIndex] = useState<number>(indexNumber);
  // callbacks
  // 닫힐 때는 index -1 , 열릴 때는 index 0

  const { selectedEmotions, setSelectedEmotion, addEmotion, updateEmotion } = useEmotionStore();
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, []);
  // 키보드 높이 관리
  const [keyboardHeight, setKeyboardHeight] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const bottomSheetRef = useRef<BottomSheet>(null);
  const handleClosePress = () => {
    Keyboard.dismiss();
    bottomSheetRef.current.close();
  };
  const insets = useSafeAreaInsets();

  //감정 적은 적 있는지 확인
  useEffect(() => {
    //console.log('selectedEmotionsssss', selectedEmotions);
    const customEmotion = selectedEmotions.find((emotion) => emotion.type === 'custom');
    //console.log('customEmotion', customEmotion);
    //console.log('selectedEmotions', selectedEmotions);
    if (customEmotion) {
      setText(customEmotion.keyword);
      setSelectedStatus(emotions.indexOf(customEmotion.group));
    }
  }, []);

  // 키보드 등장 시 높이 저장
  const handleKeyboardDidShow = useCallback((e: KeyboardEvent) => {
    setKeyboardHeight(e.endCoordinates.height);
  }, []);

  // 키보드 숨김 시 높이 초기화
  const handleKeyboardDidHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);

  useEffect(() => {
    Analytics.watchCustomEmotionSheet();
    const showSub = Keyboard.addListener('keyboardDidShow', handleKeyboardDidShow);
    const hideSub = Keyboard.addListener('keyboardDidHide', handleKeyboardDidHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [handleKeyboardDidShow, handleKeyboardDidHide]);

  const snapPoints = ['35%'];

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
    return text.length === 0 || text.length > 10 || selectedStatus === -1;
  };

  // 감정 아이콘 클릭 이벤트
  const handleEmotionPress = (emotion: string) => {
    console.log(`${emotion} icon click`);
    switch (emotion) {
      case 'happy':
        setSelectedStatus(0);
        break;
      case 'angry':
        setSelectedStatus(1);
        break;
      case 'sad':
        setSelectedStatus(2);
        break;
      case 'calm':
        setSelectedStatus(3);
        break;
      case 'normal':
        setSelectedStatus(4);
        break;
    }

    // 감정 선택 시 추가 로직 구현 가능
  };
  //console.log('custom-bottomsheet', bottomSheetRef);

  //원하는 인덱스로 이동하는 핸들러
  const handlePress = (index: number) => {
    bottomSheetRef.current?.snapToIndex(index);
  };
  // 항상 배경이 보이도록 appearsOnIndex와 disappearsOnIndex 조정, opacity를 1로 설정
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.8} // 최대 불투명도
        appearsOnIndex={0} // 배경이 나타났을 때 snap point index 지정
        disappearsOnIndex={-1} // 배경이 사라질 때 snap point index 지정
        onPress={handleClosePress} // 배경 클릭 시 닫히도록 설정
      />
    ),
    [],
  );
  return (
    <BottomSheet
      backdropComponent={renderBackdrop}
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
          //background-color: red;
          padding-bottom: ${insets.bottom}px;
          padding-horizontal: ${rsWidth * 20}px;
        `}>
        <IntroContainer>
          <IntroText>나의 감정을 자유롭게 표현해보세요</IntroText>
        </IntroContainer>

        <EmotionIconContainer>
          {emotions.map((emotion, index) => (
            <EmotionIcon
              key={index}
              status={emotion}
              size={50}
              onPress={() => handleEmotionPress(emotion)}
              selected={selectedStatus === index}
            />
          ))}
        </EmotionIconContainer>

        <BottomSheetTextInputContainer>
          <StyledBottomSheetTextInput
            autoFocus
            placeholder="지금 느끼는 감정은?"
            value={text}
            onChangeText={setText}
          />
          <TextLengthAlert text={text || ''}>{text.length}/10</TextLengthAlert>
        </BottomSheetTextInputContainer>
        <ButtonContainer>
          <Button
            title="나의 감정 추가하기"
            primary={true}
            disabled={validateButton(text)}
            onPress={() => {
              Analytics.clickAddCustomEmotionButton(text);
              //console.log('😀😀😀😀😀😀');
              const customEmotion: Emotion = {
                keyword: text,
                group: emotions[selectedStatus],
                type: 'custom',
              };
              // 동일한 keyword를 가진 custom 타입의 감정이 있는지 확인
              const exists = selectedEmotions.find((e) => e.type === 'custom');
              //console.log('exists', exists);

              if (exists) {
                updateEmotion(text, customEmotion);
              } else {
                addEmotion(customEmotion);
              }
              handleClosePress();
            }}
          />
        </ButtonContainer>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;
