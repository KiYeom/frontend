import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import palette from '../../../../../assets/styles/theme';
import { rsHeight, rsWidth, rsFont } from '../../../../../utils/responsive-size';
import Animated, { FadeInDown } from 'react-native-reanimated';
interface MessageBubbleProps {
  message: any;
  onToggleSave: (messageId: string) => void;
}

export const MessageBubble = ({ message, onToggleSave }: MessageBubbleProps) => {
  console.log('메세지 버블 렌더링', message);
  if (!message) return null;
  const handleFavorite = () => {
    onToggleSave(message._id);
    //Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
  };
  return (
    <Animated.View entering={FadeInDown} style={styles.container}>
      <View style={styles.textContainer}>
        {message.position === 'left' ? (
          <>
            <TouchableOpacity activeOpacity={1}>
              <View style={[styles.messageBubble, { backgroundColor: palette.neutral[100] }]}>
                {message.text ? <Text style={styles.messageText}>{message.text}</Text> : null}
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.time}>14:38</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity>
              <Text style={styles.time}>14:38</Text>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={1}>
              <View style={[styles.messageBubble, { backgroundColor: palette.primary[100] }]}>
                {message.text ? <Text style={styles.messageText}>{message.text}</Text> : null}
              </View>
            </TouchableOpacity>
          </>
        )}
      </View>
      <View>
        {/* 좋아요 버튼 */}
        <TouchableOpacity onPress={() => onToggleSave(message._id)} style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>{message.isSaved ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: rsHeight * 5,
    backgroundColor: 'red',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  messageBubble: {
    //backgroundColor: palette.neutral[100],
    paddingHorizontal: rsWidth * 12,
    paddingVertical: rsHeight * 8,
    borderRadius: 10,
    maxWidth: rsWidth * 200,
    marginBottom: rsHeight * 5,
  },
  messageBubbleLeft: {
    backgroundColor: palette.neutral[100],
  },
  messageBubbleRight: {
    backgroundColor: palette.primary[500],
  },
  messageText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: rsFont * 14,
    color: palette.neutral[500],
    margin: 0,
  },
  favoriteButton: {
    marginTop: rsHeight * 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  favoriteIcon: {
    fontSize: 18,
  },
  time: {
    fontFamily: 'Pretendard-Regular',
    fontSize: rsFont * 12,
    color: palette.neutral[400],
    marginTop: rsHeight * 2,
  },
});
