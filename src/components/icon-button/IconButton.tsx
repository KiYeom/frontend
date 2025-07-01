import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
import Icon, { TIconName } from '../icons/icons';

type IconButtonProps = {
  name: TIconName;
  width?: string;
  height?: string;
  disabled?: boolean;
  title?: string;
  onPress?: () => void;
};

const IconButton = (props: IconButtonProps) => {
  const { name, width = 24, height = 24, disabled = false, onPress } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor: disabled ? palette.neutral[200] : palette.neutral[50],
        width: 36,
        height: 36,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Icon name={name} disabled={disabled} />
    </TouchableOpacity>
  );
};
export default IconButton;
