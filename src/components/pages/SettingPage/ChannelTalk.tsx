import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';

const ChannelTalk: React.FC = () => {
  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: 'https://j2wk7.channel.io/home' }}
        allowsBackForwardNavigationGestures={true}
        style={styles.webview}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
});

export default ChannelTalk;
