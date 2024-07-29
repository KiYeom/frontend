import React from 'react';
import CustomCheckBox from '../atoms/CustomCheckBox';
import { View, StyleSheet } from 'react-native';
const DeactivateReasonCheckBoxs = () => {
  const reasons = [
    '쿠키가 나의 이야기를 잘 이해하지 못했다',
    '쿠키가 나를 잘 공감해주지 못했다',
    '쿠키가 나에게 상처가 되는 말을 했다',
    '기타',
  ];
  return (
    <View style={styles.container}>
      {reasons.map(item => (
        <CustomCheckBox key={item} title={item} />
      ))}
    </View>
  );
};
export default DeactivateReasonCheckBoxs;

const styles = StyleSheet.create({
  container: {
    //backgroundColor: 'blue',
  },
});
