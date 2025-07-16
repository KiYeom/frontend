import LottieView from 'lottie-react-native';
import { useSharedValue } from 'react-native-reanimated';
import { useRef, useEffect } from 'react';
import { useAnimatedStyle, withDelay, withTiming, Easing } from 'react-native-reanimated';

export const useShowCookieAnimation = () => {
  const opacity = useSharedValue(0.7);
  const lottieRef = useRef<LottieView>(null);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    flex: 1,
    width: '100%',
  }));

  useEffect(() => {
    opacity.value = withDelay(
      300,
      withTiming(1, { duration: 1500, easing: Easing.bezier(0.16, 1, 0.3, 1) }),
    );

    setTimeout(() => {
      lottieRef.current?.play();
    }, 300);
  }, []);

  return { animatedStyle, lottieRef };
};
