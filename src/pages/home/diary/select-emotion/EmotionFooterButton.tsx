import React from 'react';
import { Platform } from 'react-native';
import { KeyboardStickyView } from 'react-native-keyboard-controller';
import Button from '../../../../components/button/Button';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useEmotionStore from '../../../../store/useEmotionStore';
import { rsHeight } from '../../../../utils/responsive-size';
import { MAX_SELECTED_EMOTION_COUNT } from '../../../../constants/Constants';

type Props = {
  onNoEmotionPress: () => void;
  onGoToDiary: () => void;
};

const EmotionFooterButtons = ({ onNoEmotionPress, onGoToDiary }: Props) => {
  const insets = useSafeAreaInsets();
  const selectedCount = useEmotionStore((state) => state.allSelectedEmotions.length);

  return (
    <KeyboardStickyView
      offset={{ closed: 0, opened: Platform.OS === 'ios' ? insets.bottom : 0 }}
      style={{
        padding: rsHeight * 10,
        flexDirection: 'column',
        gap: rsHeight * 10,
        justifyContent: 'center',
        height: rsHeight * 150,
      }}>
      <Button
        title="원하는 감정이 없어요"
        disabled={selectedCount === MAX_SELECTED_EMOTION_COUNT}
        primary={false}
        onPress={onNoEmotionPress}
      />
      <Button
        title="마음일기 쓰러가기"
        primary={true}
        disabled={selectedCount === 0}
        onPress={onGoToDiary}
      />
    </KeyboardStickyView>
  );
};

export default EmotionFooterButtons;
