import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import Markdown from 'react-native-markdown-display';
import { markdownContent } from '../../../constants/PrivacyPolicy';
//설정 - 개인정보 처리방침 페이지
const PrivacyPolicy: React.FC = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
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
