import React, { useEffect, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  SharedValue,
} from 'react-native-reanimated';

const BAR_COUNT = 5;

export const AudioBars = ({ volume }: { volume: number }) => {
  // ✅ Hook 최상단에서만 호출
  const bar1 = useSharedValue(0);
  const bar2 = useSharedValue(0);
  const bar3 = useSharedValue(0);
  const bar4 = useSharedValue(0);
  const bar5 = useSharedValue(0);

  const bars = useRef([bar1, bar2, bar3, bar4, bar5]).current;

  // ✅ useAnimatedStyle도 최상단에서 정적 호출
  const animatedStyle1 = useAnimatedStyle(() => ({ height: bar1.value * 80 + 5 }));
  const animatedStyle2 = useAnimatedStyle(() => ({ height: bar2.value * 80 + 5 }));
  const animatedStyle3 = useAnimatedStyle(() => ({ height: bar3.value * 80 + 5 }));
  const animatedStyle4 = useAnimatedStyle(() => ({ height: bar4.value * 80 + 5 }));
  const animatedStyle5 = useAnimatedStyle(() => ({ height: bar5.value * 80 + 5 }));

  const animatedStyles = [
    animatedStyle1,
    animatedStyle2,
    animatedStyle3,
    animatedStyle4,
    animatedStyle5,
  ];

  // 🔁 volume 변화 시 shared value 갱신
  useEffect(() => {
    const safeVolume = Math.max(volume, 0.001);
    const amplified = Math.pow(safeVolume, 0.7);

    bars.forEach((bar) => {
      const randomness = 0.5 + Math.random() * 0.7;
      bar.value = withTiming(amplified * randomness, {
        duration: 120,
      });
    });
  }, [volume]);

  return (
    <View style={styles.container}>
      {bars.map((_, i) => (
        <Animated.View key={i} style={[styles.bar, animatedStyles[i]]} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 6,
  },
  bar: {
    width: 6,
    backgroundColor: 'white',
    borderRadius: 3,
  },
});
