import React from 'react';
import { View, Text } from 'react-native';
import { Checkbox } from 'react-native-ui-lib';
import palette from '../../assets/styles/theme';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import TextArea from '../textarea/TextArea';
import { Container } from './CustomCheckBox.style';
const CustomCheckBox = ({ title, checked, toggleCheck, index, text, setText }: any) => {
  return (
    <Container>
      <Checkbox
        value={checked}
        label={title}
        color={checked ? palette.primary[400] : palette.neutral[200]}
        onValueChange={() => {
          toggleCheck(index);
        }}
        containerStyle={styles.checkbox} //체크박스와 라벨을 포함하는 전체 컨테이너
        labelStyle={styles.label} //라벨 스타일링
      />
      {checked && title === '기타' && (
        <TextArea
          placeholder="떠나시는 이유를 작성해주세요"
          value={text}
          onChange={(text) => setText(text)}
        />
      )}
    </Container>
  );
};
export default CustomCheckBox;
const styles = StyleSheet.create({
  checkbox: {
    marginBottom: 20, //체크박스와의 사이를 20씩 간격 띄움
  },
  label: {
    fontSize: 16, //예시 : 폰트 사이즈
  },
});
