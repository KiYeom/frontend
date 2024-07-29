import React from 'react';
import { useState } from 'react';
import { TextField } from 'react-native-ui-lib'; //eslint-disable-line
import palette from '../../assets/styles/theme';
import { StyleSheet } from 'react-native';
const CustomTextArea: React.FC = () => {
  const [text, setText] = useState('');
  return (
    <TextField
      placeholder={'떠나시는 이유를 작성해주세요.'}
      placeholderTextColor={palette.neutral[300]}
      floatingPlaceholder={false}
      value={text}
      onChangeText={setText}
      multiline
      style={styles.textarea}
    />
  );
};
export default CustomTextArea;

const styles = StyleSheet.create({
  textarea: {
    height: 120,
    backgroundColor: '#F6F6F6',
    width: '100%',
    paddingHorizontal: 18,
    paddingVertical: 18,
  },
});
