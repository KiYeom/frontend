import { EmotionIconContainer } from './emotion.styles';
import React from 'react';
import { TouchableOpacity } from 'react-native';
import { TIconName } from '../icons/icons';
import Icon from '../icons/icons';
type EmotionProps = {
  status?: string;
  size?: number;
  onPress?: () => void;
};

export const EmotionIcon = (props: EmotionProps) => {
  const { status = 'nomal', size = 30, onPress = () => {} } = props;
  return (
    <TouchableOpacity onPress={onPress}>
      <Icon name={`${status}-emotion` as TIconName} width={size + 'px'} height={size + 'px'} />
    </TouchableOpacity>
  );
};
