import React, { useState } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import EmotionCard from './EmotionCard';

const EmotionList = () => {
  const [selectedEmotions, setSelectedEmotions] = useState([
    { id: 1, emoji: '😐', label: '지루한' },
    { id: 2, emoji: '😢', label: '슬픈' },
    { id: 3, emoji: '😠', label: '격분한' },
  ]);

  const handleRemoveEmotion = (id) => {
    setSelectedEmotions(selectedEmotions.filter((emotion) => emotion.id !== id));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={selectedEmotions}
        renderItem={({ item }) => <EmotionCard emotion={item} onDelete={handleRemoveEmotion} />}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
});

export default EmotionList;
