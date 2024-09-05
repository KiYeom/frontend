import React from 'react';
import { Chip } from 'react-native-ui-lib'; // Wix의 UI 라이브러리에서 가져오기
import { View, Text, TouchableOpacity } from 'react-native';
import { css } from '@emotion/native';
import palette from '../../../assets/styles/theme';
import Icon from '../../icons/icons';
import { rsWidth, rsHeight, rsFont } from '../../../utils/responsive-size';
const EmotionChip = ({ emotion, onSelect }) => {
  return (
    <TouchableOpacity
      style={css`
        background-color: ${palette.neutral[100]};
        height: ${50 * rsHeight + 'px'};
        flex-direction: row;
        align-items: center;
        padding-horizontal: ${rsWidth * 10 + 'px'};
        padding-vertical: ${rsHeight * 10 + 'px'};
        border-radius: 10px;
        gap: ${rsWidth * 10 + 'px'};
      `}>
      <Icon name={'happy-emotion'} width={rsWidth * 30 + 'px'} />
      <Text
        style={css`
          background-color: gray;
          flex: 1;
          text-align: center;
        `}>
        앙뇽
      </Text>
    </TouchableOpacity>
  );

  /*const avatarImage = {
    uri: 'https://randomuser.me/api/portraits/women/24.jpg',
  };
  return (
    <Chip
      label={`${emotion.emoji} ${emotion.label}`}
      avatarProps={{ source: avatarImage, size: 20 }}
      onPress={() => console.log('눌림')}
      containerStyle={{ margin: 5 }}
    />
  );*/
};

export default EmotionChip;
