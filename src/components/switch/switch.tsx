import React, { useEffect, useState } from 'react';
import { animatedViewStyle, SwitchContainer } from './switch.styles';
import { Animated, Easing } from 'react-native';
import palette from '../../assets/styles/theme';

export type SwitchProps = {
  isEnabled: boolean;
  disabled?: boolean;
  onPress?: () => void;
};

const SwitchComponent = (props: SwitchProps) => {
  const { isEnabled, disabled = false, onPress = () => {} } = props;
  const [animatedValue] = useState(new Animated.Value(isEnabled ? 1 : 0));
  const color = disabled
    ? palette.neutral[100]
    : isEnabled
      ? palette.primary[500]
      : palette.neutral[200];

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 17],
  });

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isEnabled ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isEnabled, animatedValue]);

  return (
    <SwitchContainer onPress={onPress} color={color} disabled={disabled} activeOpacity={1}>
      <Animated.View
        style={{
          ...animatedViewStyle,
          transform: [{ translateX }],
        }}
      />
    </SwitchContainer>
  );
};

export default SwitchComponent;
