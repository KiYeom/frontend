import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { markdownContent } from '../../../constants/PrivacyPolicy';

const PrivacyPolicy: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Markdown>{markdownContent}</Markdown>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  scrollView: {
    paddingVertical: 20,
  },
});

export default PrivacyPolicy;
