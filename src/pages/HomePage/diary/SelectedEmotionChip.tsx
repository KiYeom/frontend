import React from 'react';
import { EmotionDesc, SmallTitle, Title } from './EmotionChart.style';
import useEmotionStore from '../../../store/useEmotionStore';
import { Text } from 'react-native';
import { emotionsByColumn } from '../../../constants/Constants';
import EmotionCardDefault from './EmotionCardDefault';
import { rsHeight, rsWidth } from '../../../utils/responsive-size';
import { View } from 'react-native';
import { all } from 'axios';
const SelectedEmotionChip = () => {
  const allSelectedEmotions = useEmotionStore((state) => state.allSelectedEmotions);
  const isSelected = useEmotionStore((state) =>
    state.selectedEmotionKeywords.has(allSelectedEmotions[allSelectedEmotions.length - 1]?.keyword),
  );

  console.log('선택된 감정들:', allSelectedEmotions);
  console.log('선감', allSelectedEmotions[0]?.desc);
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
