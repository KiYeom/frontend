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
  if (!message) return null;
  const isUser = message.user?.name === '나';

  return (
    <Animated.View
      entering={FadeInDown}
      style={[styles.container, { alignItems: isUser ? 'flex-end' : 'flex-start' }]}>
      <View style={[styles.textContainer, { flexDirection: isUser ? 'row-reverse' : 'row' }]}>
        <TouchableOpacity activeOpacity={1}>
          <View
            style={[
              styles.messageBubble,
              {
                backgroundColor: isUser ? palette.primary[500] : palette.neutral[100],
              },
            ]}>
            {message.text ? (
              <Text style={[styles.messageText, { color: isUser ? '#fff' : palette.neutral[500] }]}>
                {message.text}
              </Text>
            ) : null}
          </View>
        </TouchableOpacity>
        <Text style={styles.time}>14:38</Text>
      </View>

      <TouchableOpacity onPress={() => onToggleSave(message._id)} style={styles.favoriteButton}>
        <Text style={styles.favoriteIcon}>{message.isSaved ? '❤️' : '🤍'}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: rsHeight * 5,
  },
  textContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: rsWidth * 6,
  },
  messageBubble: {
    paddingHorizontal: rsWidth * 12,
    paddingVertical: rsHeight * 8,
    borderRadius: 10,
    maxWidth: rsWidth * 200,
  },
  messageText: {
    fontFamily: 'Pretendard-Regular',
    fontSize: rsFont * 14,
  },
  time: {
    fontFamily: 'Pretendard-Regular',
    fontSize: rsFont * 12,
    color: palette.neutral[400],
    marginTop: rsHeight * 2,
  },
  favoriteButton: {
    marginTop: rsHeight * 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  favoriteIcon: {
    fontSize: 18,
  },
});
