// components/MicVisualization.tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, ViewStyle } from 'react-native';
import Svg, { G, Path, Circle, Defs, ClipPath, Rect } from 'react-native-svg';

interface MicVisualizationProps {
  waveform: number[]; // 0-1 사이의 정규화된 오디오 레벨 배열
  isActive: boolean;
  style?: ViewStyle;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const MicVisualization: React.FC<MicVisualizationProps> = ({
  waveform,
  isActive,
  style,
}) => {
  // 각 원에 대한 애니메이션 값
  const circle1Scale = useRef(new Animated.Value(1)).current;
  const circle2Scale = useRef(new Animated.Value(1)).current;
  const circle3Scale = useRef(new Animated.Value(1)).current;
  const circle4Scale = useRef(new Animated.Value(1)).current;

  const circle1Y = useRef(new Animated.Value(0)).current;
  const circle2Y = useRef(new Animated.Value(0)).current;
  const circle3Y = useRef(new Animated.Value(0)).current;
  const circle4Y = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isActive || waveform.length === 0) {
      // 비활성 상태일 때 원래 위치로 복귀
      Animated.parallel([
        Animated.spring(circle1Scale, { toValue: 1, useNativeDriver: true }),
        Animated.spring(circle2Scale, { toValue: 1, useNativeDriver: true }),
        Animated.spring(circle3Scale, { toValue: 1, useNativeDriver: true }),
        Animated.spring(circle4Scale, { toValue: 1, useNativeDriver: true }),
        Animated.spring(circle1Y, { toValue: 0, useNativeDriver: true }),
        Animated.spring(circle2Y, { toValue: 0, useNativeDriver: true }),
        Animated.spring(circle3Y, { toValue: 0, useNativeDriver: true }),
        Animated.spring(circle4Y, { toValue: 0, useNativeDriver: true }),
      ]).start();
      return;
    }

    // 오디오 레벨 평균 계산
    const avgLevel = waveform.reduce((sum, val) => sum + val, 0) / waveform.length;

    // 각 원에 대한 다른 반응성 설정
    const animateCircle = (
      scaleAnim: Animated.Value,
      yAnim: Animated.Value,
      multiplier: number,
      delay: number,
    ) => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(scaleAnim, {
            toValue: 1 + avgLevel * multiplier,
            tension: 100,
            friction: 3,
            useNativeDriver: true,
          }),
          Animated.spring(yAnim, {
            toValue: -avgLevel * 10 * multiplier,
            tension: 80,
            friction: 5,
            useNativeDriver: true,
          }),
        ]),
      ]).start();
    };

    // 각 원에 다른 지연시간과 강도 적용
    animateCircle(circle1Scale, circle1Y, 0.3, 0);
    animateCircle(circle2Scale, circle2Y, 0.5, 50);
    animateCircle(circle3Scale, circle3Y, 0.4, 100);
    animateCircle(circle4Scale, circle4Y, 0.6, 150);
  }, [waveform, isActive]);

  return (
    <View style={[{ width: 86, height: 17 }, style]}>
      <Svg width="86" height="17" viewBox="0 0 86 17" fill="none">
        <Defs>
          <ClipPath id="clip0_519_30337">
            <Rect width="16" height="16" fill="white" x="0.5" y="0.667969" />
          </ClipPath>
          <ClipPath id="clip1_519_30337">
            <Rect width="16" height="16" fill="white" x="0.5" y="0.667969" />
          </ClipPath>
        </Defs>

        {/* 마이크 아이콘 - 고정 */}
        <G clipPath="url(#clip0_519_30337)">
          <G clipPath="url(#clip1_519_30337)">
            <Path
              d="M10.8346 4.33333C10.8346 3.04467 9.78997 2 8.5013 2C7.21264 2 6.16797 3.04467 6.16797 4.33333V8.66667C6.16797 9.95533 7.21264 11 8.5013 11C9.78997 11 10.8346 9.95533 10.8346 8.66667V4.33333Z"
              fill="white"
            />
            <Path
              d="M3.5 8.33594C3.5 11.0974 5.73857 13.3359 8.5 13.3359C11.2614 13.3359 13.5 11.0974 13.5 8.33594"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <Path
              d="M8.5 13.3359V15.3359"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        </G>

        {/* 애니메이션 원들 */}
        <AnimatedCircle
          cx="26.5"
          cy="8.66797"
          r="8"
          fill="white"
          transform={circle1Y.interpolate({
            inputRange: [-10, 0, 10],
            outputRange: ['translate(0, -10)', 'translate(0, 0)', 'translate(0, 10)'],
          })}
          scale={circle1Scale}
        />

        <AnimatedCircle
          cx="43.5"
          cy="8.66797"
          r="8"
          fill="white"
          transform={circle2Y.interpolate({
            inputRange: [-10, 0, 10],
            outputRange: ['translate(0, -10)', 'translate(0, 0)', 'translate(0, 10)'],
          })}
          scale={circle2Scale}
        />

        <AnimatedCircle
          cx="60.5"
          cy="8.66797"
          r="8"
          fill="white"
          transform={circle3Y.interpolate({
            inputRange: [-10, 0, 10],
            outputRange: ['translate(0, -10)', 'translate(0, 0)', 'translate(0, 10)'],
          })}
          scale={circle3Scale}
        />

        <AnimatedCircle
          cx="77.5"
          cy="8.66797"
          r="8"
          fill="white"
          transform={circle4Y.interpolate({
            inputRange: [-10, 0, 10],
            outputRange: ['translate(0, -10)', 'translate(0, 0)', 'translate(0, 10)'],
          })}
          scale={circle4Scale}
        />
      </Svg>
    </View>
  );
};
