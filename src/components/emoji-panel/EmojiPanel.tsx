import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { rsHeight, rsWidth } from '../../utils/responsive-size';
import palette from '../../assets/styles/theme';

interface EmojiPanelProps {
  isVisible: boolean;
  height: number;
  translateY: Animated.SharedValue<number>;
  opacity: Animated.SharedValue<number>;
  onEmojiSelect?: (emoji: string) => void;
}

const EmojiPanel: React.FC<EmojiPanelProps> = ({
  isVisible,
  height,
  translateY,
  opacity,
  onEmojiSelect,
}) => {
  // 애니메이션 스타일
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  if (!isVisible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        {
          //position: 'absolute',
          //bottom: 0,
          //left: 0,
          //right: 0,
          height: height,
          backgroundColor: palette.neutral[50],
          borderTopLeftRadius: rsWidth * 12,
          borderTopRightRadius: rsWidth * 12,
          borderTopWidth: 1,
          borderLeftWidth: 1,
          borderRightWidth: 1,
          borderColor: palette.neutral[200],
          zIndex: 1000,
        },
        animatedStyle,
      ]}>
      <View
        style={{
          flex: 1,
          paddingHorizontal: rsWidth * 16,
          paddingVertical: rsHeight * 16,
        }}>
        {/* 상단 핸들 바 */}
        <View
          style={{
            width: rsWidth * 40,
            height: rsHeight * 4,
            backgroundColor: palette.neutral[300],
            borderRadius: rsHeight * 2,
            alignSelf: 'center',
            marginBottom: rsHeight * 16,
          }}
        />

        {/* 이모티콘 패널 내용 - 현재는 빈 상태 */}
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: palette.neutral[100],
            borderRadius: rsWidth * 8,
          }}>
          {/* 여기에 이모티콘 그리드나 탭 등을 추가할 예정 */}
        </View>
      </View>
    </Animated.View>
  );
};

export default EmojiPanel;
