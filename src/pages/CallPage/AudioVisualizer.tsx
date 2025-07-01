import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolate,
  Extrapolate,
  runOnJS,
} from 'react-native-reanimated';
import Svg, {
  Circle,
  Path,
  Defs,
  Filter,
  FeGaussianBlur,
  FeFlood,
  FeBlend,
  LinearGradient,
  Stop,
  G,
} from 'react-native-svg';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const AnimatedG = Animated.createAnimatedComponent(G);
const AnimatedFeGaussianBlur = Animated.createAnimatedComponent(FeGaussianBlur);

interface AudioVisualizerProps {
  isReceivingAudio?: boolean; // gemini_audio 수신 중인지
  waveform?: number[]; // 오디오 웨이브폼 데이터
  isActive?: boolean; // 통화 활성 상태
  style?: any;
}

export const AudioVisualizer: React.FC<AudioVisualizerProps> = ({
  isReceivingAudio = false,
  waveform = [],
  isActive = false,
  style,
}) => {
  // Shared values
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const pulse = useSharedValue(1);
  const opacity = useSharedValue(0.7);
  const blur1 = useSharedValue(20.562);
  const blur2 = useSharedValue(15.4215);

  // gemini_audio 수신에 따른 애니메이션
  useEffect(() => {
    if (isReceivingAudio) {
      // 오디오 수신 시 확대 및 블러 증가
      scale.value = withSpring(1.3, {
        damping: 10,
        stiffness: 100,
      });
      blur1.value = withSpring(30, { damping: 15 });
      blur2.value = withSpring(20, { damping: 15 });
      opacity.value = withTiming(1, { duration: 200 });
    } else {
      // 오디오 미수신 시 원래 크기로
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 150,
      });
      blur1.value = withSpring(20.562, { damping: 20 });
      blur2.value = withSpring(15.4215, { damping: 20 });
      opacity.value = withTiming(0.7, { duration: 300 });
    }
  }, [isReceivingAudio]);

  // 통화 중 회전 애니메이션
  useEffect(() => {
    if (isActive) {
      rotation.value = withRepeat(withTiming(360, { duration: 20000 }), -1, false);
    } else {
      rotation.value = withTiming(0, { duration: 1000 });
    }
  }, [isActive]);

  // 펄스 애니메이션 (통화 중일 때만)
  useEffect(() => {
    if (isActive) {
      pulse.value = withRepeat(
        withSequence(withTiming(1.05, { duration: 1000 }), withTiming(1, { duration: 1000 })),
        -1,
        true,
      );
    } else {
      pulse.value = withTiming(1, { duration: 500 });
    }
  }, [isActive]);

  // 웨이브폼에 따른 동적 효과
  useEffect(() => {
    if (waveform.length > 0) {
      const avgWaveform = waveform.reduce((a, b) => a + b, 0) / waveform.length;

      // 웨이브폼에 따라 블러 효과도 약간 변경
      const blurOffset = avgWaveform * 5;
      blur1.value = withTiming(20.562 + blurOffset, { duration: 100 });
      blur2.value = withTiming(15.4215 + blurOffset, { duration: 100 });
    }
  }, [waveform]);

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value * pulse.value }, { rotate: `${rotation.value}deg` }],
    };
  });

  const animatedOpacityStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  // 동적 블러를 위한 스타일
  const animatedBlur1Style = useAnimatedStyle(() => {
    return {
      stdDeviation: blur1.value,
    };
  });

  const animatedBlur2Style = useAnimatedStyle(() => {
    return {
      stdDeviation: blur2.value,
    };
  });

  return (
    <View style={[{ position: 'absolute', width: 493, height: 493 }, style]}>
      <Animated.View style={[{ width: '100%', height: '100%' }, animatedContainerStyle]}>
        <AnimatedSvg
          width="493"
          height="493"
          viewBox="0 0 493 493"
          fill="none"
          style={animatedOpacityStyle}>
          <Defs>
            <Filter
              id="filter0_f_537_28654"
              x="143.161"
              y="107.778"
              width="283.498"
              height="283.494"
              filterUnits="userSpaceOnUse">
              <FeFlood floodOpacity="0" result="BackgroundImageFix" />
              <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <AnimatedFeGaussianBlur
                stdDeviation={blur1.value}
                result="effect1_foregroundBlur_537_28654"
                animatedProps={animatedBlur1Style}
              />
            </Filter>
            <Filter
              id="filter1_f_537_28654"
              x="104.294"
              y="104.544"
              width="270.323"
              height="270.776"
              filterUnits="userSpaceOnUse">
              <FeFlood floodOpacity="0" result="BackgroundImageFix" />
              <FeBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <AnimatedFeGaussianBlur
                stdDeviation={blur2.value}
                result="effect1_foregroundBlur_537_28654"
                animatedProps={animatedBlur2Style}
              />
            </Filter>
            <LinearGradient
              id="paint0_linear_537_28654"
              x1="205.089"
              y1="162.77"
              x2="345.543"
              y2="350.149"
              gradientUnits="userSpaceOnUse">
              <Stop stopColor="#6100FF" />
              <Stop offset="1" stopColor="#00FFFF" stopOpacity="0" />
            </LinearGradient>
            <LinearGradient
              id="paint1_linear_537_28654"
              x1="368.304"
              y1="370.679"
              x2="124.353"
              y2="121.975"
              gradientUnits="userSpaceOnUse">
              <Stop stopColor="#0075FF" stopOpacity="0.75" />
              <Stop offset="1" stopColor="#00FFFF" stopOpacity="0" />
            </LinearGradient>
          </Defs>

          <G filter="url(#filter0_f_537_28654)">
            <Circle
              cx="284.91"
              cy="249.526"
              r="100.624"
              transform="rotate(135.553 284.91 249.526)"
              fill="url(#paint0_linear_537_28654)"
            />
          </G>

          <G opacity="0.7" filter="url(#filter1_f_537_28654)">
            <Path
              d="M341.769 267.685C353.563 313.46 311.381 354.836 265.841 342.162L180.112 318.302C134.573 305.628 119.832 248.409 153.577 215.308L217.105 152.994C250.851 119.893 307.775 135.736 319.568 181.511L341.769 267.685Z"
              fill="url(#paint1_linear_537_28654)"
            />
          </G>
        </AnimatedSvg>
      </Animated.View>
    </View>
  );
};
