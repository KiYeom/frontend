import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const EmotionCard = ({ emotion, onDelete }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.emoji}>{emotion.emoji}</Text>
      <Text style={styles.label}>{emotion.label}</Text>
      <TouchableOpacity onPress={() => onDelete(emotion.id)} style={styles.deleteButton}>
        <Text style={styles.deleteText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 120,
    padding: 10,
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#f1f1f1',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 36,
  },
  label: {
    marginTop: 5,
    fontSize: 16,
  },
  deleteButton: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  deleteText: {
    fontSize: 14,
    color: '#ff0000',
  },
});

export default EmotionCard;
