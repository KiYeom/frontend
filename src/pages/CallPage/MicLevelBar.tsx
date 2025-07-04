import React, { useEffect, useRef } from 'react';
import { Animated, View, StyleSheet } from 'react-native';

const BAR_COUNT = 5;

export const AudioBars = ({ volume }: { volume: number }) => {
  const animatedValues = useRef(
    Array.from({ length: BAR_COUNT }, () => new Animated.Value(0)),
  ).current;

  useEffect(() => {
    animatedValues.forEach((animated, index) => {
      const amplified = Math.pow(volume, 0.7); // ← 여기!
      const target = amplified * (0.5 + Math.random() * 0.7); // 각 막대마다 랜덤 세기
      Animated.timing(animated, {
        toValue: target,
        duration: 150,
        useNativeDriver: false,
      }).start();
    });
  }, [volume]);

  return (
    <View style={styles.container}>
      {animatedValues.map((animated, i) => {
        const height = animated.interpolate({
          inputRange: [0, 1],
          outputRange: [5, 80], // 최소/최대 길이
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.bar,
              {
                height,
              },
            ]}
          />
        );
      })}
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
