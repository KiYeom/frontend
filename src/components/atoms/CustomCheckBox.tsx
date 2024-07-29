import React from 'react';
import { View, Text } from 'react-native';
import { Checkbox } from 'react-native-ui-lib';
import palette from '../../assets/styles/theme';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
const CustomCheckBox = (props: { title: string }) => {
  const [isCheck, setIsCheck] = useState(false);
  return (
    <Checkbox
      value={isCheck}
      label={props.title}
      color={isCheck ? palette.primary[400] : palette.neutral[200]}
      onValueChange={() => setIsCheck(!isCheck)}
      containerStyle={styles.checkbox} //체크박스와 라벨을 포함하는 전체 컨테이너
      labelStyle={styles.label} //라벨 스타일링
    />
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
