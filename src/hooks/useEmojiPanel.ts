import { useState, useEffect, useCallback } from 'react';
import { Keyboard, Dimensions } from 'react-native';
import { useSharedValue, withSpring, withTiming, runOnJS } from 'react-native-reanimated';

export const useEmojiPanel = () => {
  const [isEmojiPanelVisible, setIsEmojiPanelVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [emojiPanelHeight, setEmojiPanelHeight] = useState(350); // 기본 이모티콘 패널 높이

  // 애니메이션 값
  const translateY = useSharedValue<number>(emojiPanelHeight);
  const opacity = useSharedValue(0);

  // 키보드 이벤트 리스너
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const onKeyboardDidShow = useCallback(
    (event: any) => {
      const height = event.endCoordinates.height;
      setKeyboardHeight(height);

      // 키보드가 올라올 때 이모티콘 패널이 열려있다면 닫기
      if (isEmojiPanelVisible) {
        hideEmojiPanel();
      }
    },
    [isEmojiPanelVisible],
  );

  const onKeyboardDidHide = useCallback(() => {
    setKeyboardHeight(0);
  }, []);

  // 이모티콘 패널 표시하는 showEmojiPanel 함수
  /*const showEmojiPanel = useCallback(() => {
    // 키보드가 열려있다면 먼저 닫기
    if (keyboardHeight > 0) {
      Keyboard.dismiss();
    }

    setIsEmojiPanelVisible(true);

    // Y = 0 위치 (화면 바닥)에 스프링으로 튕기듯 이동
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 300,
    });
    // 0 -> 1로 0.5초간 페이드인
    opacity.value = withTiming(1, { duration: 500 });
  }, [keyboardHeight, translateY, opacity]);*/

  //이모티콘 패널을 표시하는 showEmojiPanel 함수
  const showEmojiPanel = useCallback(() => {
    // 키보드가 열려있다면 먼저 닫고 딜레이 후 패널 열기
    if (keyboardHeight > 0) {
      Keyboard.dismiss();
      // 키보드가 완전히 닫힐 때까지 기다린 후 패널 열기
      setTimeout(() => {
        setIsEmojiPanelVisible(true);
        translateY.value = withTiming(0, { duration: 250 });
        opacity.value = withTiming(1, { duration: 250 });
      }, 250); // 키보드 애니메이션 시간과 맞춤
    } else {
      setIsEmojiPanelVisible(true);
      translateY.value = withTiming(0, { duration: 250 });
      opacity.value = withTiming(1, { duration: 250 });
    }
  }, [keyboardHeight, translateY, opacity]);
  // 이모티콘 패널 숨기기
  /*const hideEmojiPanel = useCallback(() => {
    // 애니메이션으로 숨기기
    translateY.value = withSpring(emojiPanelHeight, {
      damping: 20,
      stiffness: 300,
    });
    opacity.value = withTiming(0, { duration: 200 });

    // 애니메이션 완료 후 상태 변경
    setTimeout(() => {
      setIsEmojiPanelVisible(false);
    }, 300);
  }, [emojiPanelHeight, translateY, opacity]);*/

  //이모티콘 패널을 숨기는 hideEmojiPanel 함수
  // 이모티콘 패널 숨기기
  const hideEmojiPanel = useCallback(() => {
    translateY.value = withTiming(
      emojiPanelHeight,
      {
        duration: 250,
      },
      (finished) => {
        // 애니메이션 완료 후 상태 변경
        if (finished) {
          runOnJS(setIsEmojiPanelVisible)(false);
        }
      },
    );
    opacity.value = withTiming(0, { duration: 250 });
  }, [emojiPanelHeight, translateY, opacity]);
  // 이모티콘 패널 토글
  const toggleEmojiPanel = useCallback(() => {
    if (isEmojiPanelVisible) {
      hideEmojiPanel();
    } else {
      showEmojiPanel();
    }
  }, [isEmojiPanelVisible, showEmojiPanel, hideEmojiPanel]);

  // 이모티콘 선택 핸들러
  const onEmojiSelect = useCallback((emoji: string) => {
    // 이모티콘 선택 로직 (나중에 텍스트 입력에 추가하는 로직 구현)
    console.log('Selected emoji:', emoji);
  }, []);

  // 패널 높이를 고정값으로 유지 (키보드 높이에 따라 변경하지 않음)
  useEffect(() => {
    // 키보드 높이가 변경되어도 이모티콘 패널 높이는 고정
    const fixedHeight = Math.max(keyboardHeight, 250); // 최소 250, 키보드보다 작지 않게
    setEmojiPanelHeight(fixedHeight);
  }, [keyboardHeight]);

  // translateY 초기값을 패널 높이로 설정
  useEffect(() => {
    if (!isEmojiPanelVisible) {
      translateY.value = emojiPanelHeight;
    }
  }, [emojiPanelHeight, isEmojiPanelVisible]);

  return {
    isEmojiPanelVisible,
    emojiPanelHeight,
    keyboardHeight,
    translateY,
    opacity,
    showEmojiPanel,
    hideEmojiPanel,
    toggleEmojiPanel,
    onEmojiSelect,
  };
};
