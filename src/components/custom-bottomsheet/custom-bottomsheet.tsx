import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Keyboard, KeyboardEvent } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { css } from '@emotion/native';
import { rsWidth } from '../../utils/responsive-size';
import { EmotionIcon } from '../../components/emotionIcon/emotionIcon';
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
import useEmotionStore from '../../store/useEmotionStore';
import Analytics from '../../utils/analytics';

interface BottomSheetProps {
  indexNumber?: number;
  isOpen?: boolean;
  onClose?: () => void;
  onSubmit?: (text: string) => void;
  // 추가적인 props 가 필요하면 여기서 정의
}

const emotions = ['happy', 'angry', 'sad', 'calm', 'normal'];

const CustomBottomSheet = (props: BottomSheetProps) => {
  const { indexNumber, isOpen = false, onClose = () => {}, onSubmit = () => {} } = props;
  //감정 입력 상태를 저장하는 state : boolean 타입, 5개
  const [selectedStatus, setSelectedStatus] = useState<number>(-1);

  const [index, setIndex] = useState<number>(indexNumber);
  // callbacks
  // 닫힐 때는 index -1 , 열릴 때는 index 0

  const { allSelectedEmotions, addEmotion, removeEmotion } = useEmotionStore();

  //const { selectedEmotions, setSelectedEmotion, addEmotion, updateEmotion } = useEmotionStore();
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

  useEffect(() => {
    if (index === 0) {
      console.log('CustomBottomSheet isOpen:', isOpen);
      const customEmotion = allSelectedEmotions.find((emotion) => emotion.type === 'custom');
      console.log('customEmotion', customEmotion);
      if (customEmotion) {
        setText(customEmotion.keyword);
        const emotionIndex = emotions.indexOf(customEmotion.group as EmotionType);
        setSelectedStatus(emotionIndex);
      }
    }
  }, [index]);

  // 키보드 등장 시 높이 저장
  const handleKeyboardDidShow = useCallback((e: KeyboardEvent) => {
    setKeyboardHeight(e.endCoordinates.height);
  }, []);

  // 키보드 숨김 시 높이 초기화
  const handleKeyboardDidHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);

  useEffect(() => {
    //Analytics.watchCustomEmotionSheet();
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

  // 감정 추가 핸들러
  const handleAddEmotion = useCallback(() => {
    Analytics.clickAddCustomEmotionButton(text);

    const customEmotion: Emotion = {
      keyword: text.trim(),
      group: emotions[selectedStatus],
      type: 'custom',
    };

    // 기존 custom 타입 감정이 있으면 먼저 제거
    const existingCustom = allSelectedEmotions.find((e) => e.type === 'custom');
    if (existingCustom) {
      removeEmotion(existingCustom.keyword);
    }

    // 새로운 custom 감정 추가
    addEmotion(customEmotion);

    // 콜백 실행
    onSubmit(text);

    // 바텀시트 닫기
    handleClosePress();
  }, [text, selectedStatus, allSelectedEmotions, removeEmotion, addEmotion, onSubmit]);

  // 감정 아이콘 클릭 이벤트
  const handleEmotionPress = useCallback((emotion: any) => {
    const emotionIndex = emotions.indexOf(emotion);
    setSelectedStatus(emotionIndex);
  }, []);

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
            onPress={handleAddEmotion}
          />
        </ButtonContainer>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default CustomBottomSheet;
