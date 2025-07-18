import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';
import Icon, { TIconName } from '../icons/icons';
import Analytics from '../../utils/analytics';

type IconButtonProps = {
  name: TIconName;
  width?: string;
  height?: string;
  disabled?: boolean;
  title?: string;
  onPress?: () => void;
};
const ICON_TITLES: Record<TIconName, string> = {
  'call-start': '통화 시작',
  'call-pause': '일시 정지',
  'call-resume': '다시 시작',
  'call-end': '통화 종료',
  // 필요에 따라 다른 아이콘도 추가
};

const IconButton = (props: IconButtonProps) => {
  const { name, width = 24, height = 24, disabled = false, title, onPress } = props;
  //call-start : 통화 시작, call-pause : 일시 정지, call-resume : 다시 시작, call-end : 통화 종료
  const displayTitle = title ?? ICON_TITLES[name] ?? '';

  return (
    <View
      style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5 }}>
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
      <Text style={{ color: disabled ? '#898989' : palette.neutral[50] }}>{displayTitle}</Text>
    </View>
  );
};
export default IconButton;
