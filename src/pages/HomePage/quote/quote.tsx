/*
quote 페이지 : 안전 영역만을 제거하고, 화면 가운데에 hellow world을 출력하는 페이지
*/
import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { rsWidth } from '../../../utils/responsive-size';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native';

const Quote: React.FC = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const animation = useRef<LottieView>(null);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Text style={styles.text}>Hello World</Text>
      <LottieView
        autoPlay
        ref={animation}
        source={require('../../../assets/motion/three-clover.json')}
        loop
        style={{
          width: 200,
          height: 200,
          backgroundColor: '#eee',
        }}
      />
    </View>
  );
};
export default Quote;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'pink',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});
