import React from 'react';
import { Chip } from 'react-native-ui-lib'; // Wix의 UI 라이브러리에서 가져오기

const EmotionChip = ({ emotion, onSelect }) => {
  return (
    <Chip
      label={`${emotion.emoji} ${emotion.label}`}
      onPress={() => onSelect(emotion)}
      containerStyle={{ margin: 5 }}
    />
  );
};

export default EmotionChip;
