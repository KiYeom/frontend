import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const ChannelTalk: React.FC = () => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        ...styles.container,
        paddingBottom: insets.bottom,
      }}>
      <WebView
        source={{ uri: 'https://j2wk7.channel.io/home' }}
        allowsBackForwardNavigationGestures={true}
        mediaCapturePermissionGrantType={'deny'} //FIX: ios 권한 없어서 튕기는 문제 발생
        style={styles.webview}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  webview: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
});

export default ChannelTalk;
