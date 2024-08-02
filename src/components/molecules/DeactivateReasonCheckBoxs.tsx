import React from 'react';
import CustomCheckBox from '../atoms/CustomCheckBox';
import { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { reasons } from '../../constants/Constants';
const DeactivateReasonCheckBoxs = ({ isChecked, setIsChecked, text, setText }: any) => {
  //const [selectedData, setSelectedData] = useState([]);
  //체크 상태를 나타내는 함수
  const toggleCheck = (index: number) => {
    setIsChecked((preIsChecked) =>
      preIsChecked.map((checked, i) => (i === index ? !checked : checked)),
    );
  };

  return (
    <View>
      {reasons.map((item, index) => (
        <CustomCheckBox
          key={index}
          title={item}
          checked={isChecked[index]}
          toggleCheck={toggleCheck}
          index={index}
          text={text}
          setText={setText}
        />
      ))}
    </View>
  );
};
export default DeactivateReasonCheckBoxs;
