import { useState, useEffect, useCallback } from 'react';
import { Keyboard, Dimensions } from 'react-native';
import { useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

export const useEmojiPanel = () => {
  const [isEmojiPanelVisible, setIsEmojiPanelVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [emojiPanelHeight, setEmojiPanelHeight] = useState(250); // 기본 이모티콘 패널 높이

  // 애니메이션 값
  const translateY = useSharedValue(0);
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

  // 이모티콘 패널 표시
  const showEmojiPanel = useCallback(() => {
    // 키보드가 열려있다면 먼저 닫기
    if (keyboardHeight > 0) {
      Keyboard.dismiss();
    }

    setIsEmojiPanelVisible(true);

    // 애니메이션 시작
    translateY.value = withSpring(0, {
      damping: 20,
      stiffness: 300,
    });
    opacity.value = withTiming(1, { duration: 200 });
  }, [keyboardHeight, translateY, opacity]);

  // 이모티콘 패널 숨기기
  const hideEmojiPanel = useCallback(() => {
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

  // 패널 높이 설정 (키보드 높이에 맞춰 조정)
  useEffect(() => {
    if (keyboardHeight > 0) {
      setEmojiPanelHeight(keyboardHeight);
    } else {
      setEmojiPanelHeight(250); // 기본 높이
    }
  }, [keyboardHeight]);

  // 초기 애니메이션 값 설정
  useEffect(() => {
    translateY.value = emojiPanelHeight;
  }, [emojiPanelHeight]);

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
