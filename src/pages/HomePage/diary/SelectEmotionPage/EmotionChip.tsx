import { css } from '@emotion/native';
import React, { memo } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import palette from '../../../../assets/styles/theme';
import { rsFont, rsHeight, rsWidth } from '../../../../utils/responsive-size';
import Icon, { TIconName } from '../../../../components/icons/icons';
import useEmotionStore from '../../../../store/useEmotionStore';
import { SelectableEmotion } from '../../../../store/useEmotionStore';
import { MAX_SELECTED_EMOTION_COUNT } from '../../../../constants/Constants';
import Toast from 'react-native-root-toast';
const EmotionChip = memo(({ group, keyword, desc }: SelectableEmotion) => {
  const isSelected = useEmotionStore((state) => state.selectedEmotionKeywords.has(keyword));
  const addEmotion = useEmotionStore((state) => state.addEmotion);
  const removeEmotion = useEmotionStore((state) => state.removeEmotion);
  //const selectedCount = useEmotionStore((state) => state.selectedCount);
  //console.log('isSelected', isSelected);
  const getSelectedEmotionCount = useEmotionStore((state) => state.getSelectedEmotionCount);

  const toggleEmotion = () => {
    if (isSelected) {
      removeEmotion(keyword);
    } else {
      //console.log('개수', selectedCount);
      const currentCount = getSelectedEmotionCount();
      //console.log('현재 선택된 감정 개수:', currentCount);
      if (currentCount >= MAX_SELECTED_EMOTION_COUNT) {
        Toast.show(`감정은 최대 ${MAX_SELECTED_EMOTION_COUNT}개까지 선택할 수 있습니다.`, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.BOTTOM,
          shadow: true,
          animation: true,
          hideOnPress: true,
        });
        return;
      }
      addEmotion({ group, keyword, type: 'default' });
    }
  };
  return (
    <TouchableOpacity
      style={css`
        background-color: ${palette.neutral[100]};
        height: ${rsHeight * 50 + 'px'};
        width: ${rsWidth * 150 + 'px'};
        flex-direction: row;
        align-items: center; /* 세로 중앙 정렬 */
        justify-content: center; /* 가로 중앙 정렬 */
        padding-horizontal: ${rsWidth * 5 + 'px'};
        padding-vertical: ${rsHeight * 5 + 'px'};
        //margin-vertical: ${rsHeight * 5 + 'px'};
        border-radius: 10px;
        border-color: ${isSelected ? palette.primary[500] : `transparent`};
        border-width: 5px;
        gap: ${rsWidth * 10 + 'px'};
      `}
      onPress={toggleEmotion}>
      <Icon name={`${group}-emotion` as TIconName} width={rsWidth * 28 + 'px'} />
      <Text
        style={css`
          flex: 1;
          text-align: center;
          justify-content: center;
          align-self: center;
          font-family: Pretendard-Regular;
          font-size: ${rsHeight * 14 + 'px'};
        `}>
        {keyword}
      </Text>
    </TouchableOpacity>
  );
});

EmotionChip.displayName = 'EmotionChip';

export default EmotionChip;
