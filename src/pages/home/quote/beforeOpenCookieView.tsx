import React, { useRef, useEffect, useMemo, useCallback } from 'react';
import { TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import Constants from 'expo-constants';
import {
  Annotation,
  TitleContainer,
  TitleTextContainter,
  Title,
  Container,
  AnimationContainer,
} from './QutoePage.style';

const BeforeOpenCookieView: React.FC<{
  onOpenCookie: () => void;
}> = ({ onOpenCookie }) => {
  const animation = useRef<LottieView>(null);
  const insets = useSafeAreaInsets();

  return (
    <Container insets={insets}>
      <TitleContainer>
        <TitleTextContainter>
          <Annotation>세잎클로버를 터치해보세요!</Annotation>
          <Title>{`오늘은 어떤 행복이\n기다리고 있을까요?`}</Title>
        </TitleTextContainter>
      </TitleContainer>
      <AnimationContainer>
        <TouchableOpacity onPress={onOpenCookie}>
          <LottieView
            autoPlay
            ref={animation}
            source={require('../../../assets/motion/three-clover.json')}
            loop
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </TouchableOpacity>
      </AnimationContainer>
    </Container>
  );
};
export default BeforeOpenCookieView;
