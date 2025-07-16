import { useState, useEffect, useCallback } from 'react';
import { Keyboard, Dimensions } from 'react-native';
import { useSharedValue, withSpring, withTiming, runOnJS } from 'react-native-reanimated';
import { useCalendarStore } from '../store/calendarStore';
import { useSaveEmotion } from '../queries/emotionQueries';
import { useSaveEmotionWithImage } from '../queries/emotionQueries';
import Toast from 'react-native-root-toast';
import useEmotionStore from '../store/useEmotionStore';
import { TabScreenName, RootStackName } from '../constants/Constants';
const useDiarySubmit = (dateID, navigation) => {
  const { updateEntryStatus } = useCalendarStore();
  const saveEmotionMutation = useSaveEmotion();
  const saveEmotionWithImageMutation = useSaveEmotionWithImage();
  const [isNavigationLoading, setNavigationLoading] = useState(false);

  const handleStatusUpdate = useCallback(
    (emotions) => {
      const targetEmotion = emotions.find((e) => e.type === 'custom') || emotions[0];
      const group = targetEmotion?.group || 'normal';
      const statusToUpdate = `${group}-emotion`;
      updateEntryStatus(dateID, statusToUpdate);
    },
    [dateID, updateEntryStatus],
  );

  const navigateToHome = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: RootStackName.BottomTabNavigator,
          state: {
            routes: [{ name: TabScreenName.Home }],
          },
        },
      ],
    });
  }, [navigation]);

  const onPressSaveDiary = useCallback(async () => {
    console.log('onPressSaveDiary called');
    const { image, allSelectedEmotions, diaryText } = useEmotionStore.getState();

    try {
      setNavigationLoading(true);

      if (image.length === 0) {
        await saveEmotionMutation.mutateAsync({
          dateID,
          emotions: allSelectedEmotions,
          text: diaryText,
        });
      } else {
        await saveEmotionWithImageMutation.mutateAsync({
          dateID,
          emotions: allSelectedEmotions,
          text: diaryText,
          images: image,
        });
      }

      handleStatusUpdate(allSelectedEmotions);
      navigateToHome();
    } catch (error) {
      Toast.show('일기 저장 중 오류가 발생했습니다.');
    } finally {
      setNavigationLoading(false);
    }
  }, [
    dateID,
    saveEmotionMutation,
    saveEmotionWithImageMutation,
    handleStatusUpdate,
    navigateToHome,
  ]);

  return {
    onPressSaveDiary,
    isNavigationLoading,
  };
};
export default useDiarySubmit;
