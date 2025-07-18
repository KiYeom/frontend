//선택이 된 감정 칩 (selectEmotionPage 하단, DailyDairy 상단에 위치)
import React from 'react';
import useEmotionStore from '../../../../store/useEmotionStore';
import EmotionCardDefault from './EmotionCardDefault';
import { rsHeight, rsWidth } from '../../../../utils/responsive-size';
import { View } from 'react-native';
import Toast from 'react-native-root-toast';
import { MAX_SELECTED_EMOTION_COUNT } from '../../../../constants/Constants';
const SelectedEmotionChip = () => {
  const allSelectedEmotions = useEmotionStore((state) => state.allSelectedEmotions);
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
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: rsHeight * 12,
        gap: rsWidth * 6,
        paddingHorizontal: rsWidth * 24,
        paddingBottom: 50,
      }}>
      {allSelectedEmotions.map((emotion, index) => (
        <EmotionCardDefault key={emotion.keyword} emotion={emotion} />
      ))}
    </View>
  );
};
export default SelectedEmotionChip;
