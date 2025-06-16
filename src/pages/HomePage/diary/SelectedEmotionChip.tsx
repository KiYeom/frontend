import React from 'react';
import { EmotionDesc, SmallTitle, Title } from './EmotionChart.style';
import useEmotionStore from '../../../store/useEmotionStore';
import { Text } from 'react-native';
import { emotionsByColumn } from '../../../constants/Constants';
import EmotionCardDefault from './EmotionCardDefault';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { View } from 'react-native';
import { all } from 'axios';
import Toast from 'react-native-root-toast';
import { MAX_SELECTED_EMOTION_COUNT } from '../../../constants/Constants';
const SelectedEmotionChip = () => {
  const allSelectedEmotions = useEmotionStore((state) => state.allSelectedEmotions);

  console.log('선택된 감정들:', allSelectedEmotions.length);
  console.log('선감', allSelectedEmotions[0]?.desc);
  if (allSelectedEmotions.length > MAX_SELECTED_EMOTION_COUNT) {
    Toast.show('감정은 최대 5개까지 선택할 수 있습니다.', {
      duration: Toast.durations.SHORT,
      position: Toast.positions.BOTTOM,
      shadow: true,
      animation: true,
      hideOnPress: true,
    });
  }
  return (
    <View
      style={{
        backgroundColor: 'black',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: rsHeight * 12,
        gap: rsWidth * 6,
        paddingHorizontal: rsWidth * 24,
      }}>
      {allSelectedEmotions.map((emotion, index) => (
        <EmotionCardDefault key={emotion.keyword} emotion={emotion} />
      ))}
    </View>
  );
};
export default SelectedEmotionChip;
