import React from 'react';
import { StyleSheet } from 'react-native';
import TextArea from '../textarea/TextArea';
import { Container } from './CustomCheckBox.style';
import NewCheckBox from '../v3-checkbox/NewCheckBox';

const CustomCheckBox = ({ title, checked, toggleCheck, index, text, setText }: any) => {
  return (
    <Container>
      <NewCheckBox
        checked={checked}
        message={title}
        onToggle={() => {
          toggleCheck(index);
        }}
      />
      {checked && title === '기타' && (
        <TextArea
          placeholder="떠나시는 이유를 작성해주세요🥺"
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
