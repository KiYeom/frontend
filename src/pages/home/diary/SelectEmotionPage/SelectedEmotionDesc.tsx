import React from 'react';
import useEmotionStore from '../../../../store/useEmotionStore';
import { Text } from 'react-native';
import { View } from 'react-native';
import { emotionMap } from '../../../../constants/Constants';
const SelectedEmotionDesc = () => {
  const allSelectedEmotions = useEmotionStore((state) => state.allSelectedEmotions);
  const lastEmotion = allSelectedEmotions[allSelectedEmotions.length - 1];
  const keyword = lastEmotion?.keyword;
  const emotion = keyword ? emotionMap.get(keyword) : undefined;

  return (
    <View
      style={{
        marginVertical: 12,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {lastEmotion?.type === 'default' && emotion && (
        <Text style={{ fontSize: 15, fontFamily: 'Kyobo-handwriting' }}>
          {keyword} : {emotion.desc}
        </Text>
      )}
    </View>
  );
};
export default SelectedEmotionDesc;
