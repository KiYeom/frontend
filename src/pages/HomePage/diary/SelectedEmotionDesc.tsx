import React from 'react';
import { EmotionDesc, SmallTitle, Title } from './EmotionChart.style';
import useEmotionStore from '../../../store/useEmotionStore';
import { Text } from 'react-native';
import { emotionsByColumn, emotionData } from '../../../constants/Constants';
import EmotionCardDefault from './EmotionCardDefault';
import { View } from 'react-native';
import { all } from 'axios';
import SelectedEmotionChip from './SelectedEmotionChip';
const SelectedEmotionDesc = () => {
  const allSelectedEmotions = useEmotionStore((state) => state.allSelectedEmotions);
  const isSelected = useEmotionStore((state) =>
    state.selectedEmotionKeywords.has(allSelectedEmotions[allSelectedEmotions.length - 1]?.keyword),
  );

  console.log('선택된 감정들:', allSelectedEmotions);
  console.log('선감', allSelectedEmotions[0]?.desc);
  return (
    <>
      <View style={{ marginVertical: 12, justifyContent: 'center', alignItems: 'center' }}>
        {allSelectedEmotions.length > 0 &&
          allSelectedEmotions[allSelectedEmotions.length - 1]?.type === 'default' && (
            <Text style={{ fontSize: 15, fontFamily: 'Kyobo-handwriting' }}>
              {allSelectedEmotions[allSelectedEmotions.length - 1]?.keyword} :{' '}
              {emotionData[allSelectedEmotions[allSelectedEmotions.length - 1]?.keyword]?.desc}
            </Text>
          )}
      </View>

      {/*selectedEmotions.length > 0 && (
            <View
              style={css`
                margin-top: ${rsHeight * 12 + 'px'};
                //background-color: gray;
                height: ${rsHeight * 80 + 'px'};
                flex-direction: row;
                flex-wrap: wrap;
                gap: ${rsWidth * 6 + 'px'};
                padding-horizontal: ${rsWidth * 24 + 'px'};
              `}>
              {selectedEmotions.length > 0
                ? selectedEmotions.map((emotion, i) => (
                    <EmotionCard
                      key={i}
                      emotion={emotion}
                      onPress={handleRemoveEmotion}
                      status={'default'}
                    />
                  ))
                : ''}
            </View>
          )*/}
    </>
  );
};
export default SelectedEmotionDesc;
