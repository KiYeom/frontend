import { View, Text, StyleSheet } from 'react-native';
import React from 'react';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>다이어리 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
