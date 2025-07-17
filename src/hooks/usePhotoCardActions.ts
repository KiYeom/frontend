import { captureRef } from 'react-native-view-shot';
import * as MediaLibrary from 'expo-media-library';
import { View, Alert } from 'react-native';
import * as Sharing from 'expo-sharing';
import { RefObject } from 'react';
export const usePhotoCardActions = (imageRef: RefObject<View>) => {
  const onSaveImageAsync = async () => {
    console.log('Saving image...');
    try {
      const localUri = await captureRef(imageRef.current, { height: 472, quality: 1 });
      console.log('Image captured:', localUri);
      await MediaLibrary.saveToLibraryAsync(localUri);
      Alert.alert('저장 완료🎉', '사진이 갤러리에 저장되었습니다');
    } catch (e) {
      console.log('저장 실패:', e);
      Alert.alert('저장 실패', '사진 저장에 실패했습니다. 잠시 후에 다시 시도해주세요.');
    }
  };

  const onShareImageAsync = async () => {
    console.log('Sharing image...');
    if (!(await Sharing.isAvailableAsync())) {
      return alert('이 기기에서는 공유 기능을 사용할 수 없습니다.');
    }
    try {
      const localUri = await captureRef(imageRef, { height: 440, quality: 1 });
      await Sharing.shareAsync(localUri, {
        dialogTitle: `'리마인드'에서 오늘의 행복을 확인해보세요!`,
      });
    } catch (error) {
      Alert.alert('공유 실패', '잠시 후에 다시 시도해주세요.');
    }
  };

  return { onSaveImageAsync, onShareImageAsync };
};
