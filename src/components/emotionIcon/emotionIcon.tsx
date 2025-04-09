import { EmotionIconContainer } from './emotion.styles';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { css } from '@emotion/native';
import { TIconName } from '../icons/icons';
import Icon from '../icons/icons';
type EmotionProps = {
  status?: string;
  size?: number;
  onPress?: () => void;
  selected?: boolean;
};

export const EmotionIcon = (props: EmotionProps) => {
  const { status = 'nomal', size = 30, onPress = () => {}, selected = false } = props;
  //console.log('selected', selected);
  return (
    <View style={{ opacity: selected ? 1 : 0.4 }}>
      <TouchableOpacity onPress={onPress}>
        <Icon name={`${status}-emotion` as TIconName} width={size + 'px'} height={size + 'px'} />
      </TouchableOpacity>
    </View>
  );
};
