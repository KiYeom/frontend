import React from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { rsHeight } from '../../../../utils/responsive-size';
import palette from '../../../../assets/styles/theme';
import NewCheckBox from '../../../../components/checkbox/NewCheckBox';

const CustomCheckBox = ({ title, checked, toggleCheck, index, text, setText }: any) => {
  return (
    <View style={{ gap: rsHeight * 20, paddingBottom: rsHeight * 16 }}>
      <NewCheckBox
        checked={checked}
        message={title}
        onToggle={() => {
          toggleCheck(index);
        }}
      />
      {checked && title === '기타' && (
        <TextInput
          placeholder="떠나시는 이유를 작성해주세요🥺"
          placeholderTextColor={palette.neutral[400]}
          multiline={true}
          value={text}
          onChangeText={(text) => setText(text)}
          style={{
            height: rsHeight * 100,
            backgroundColor: palette.neutral[50],
            borderRadius: 8,
            padding: 20,
            fontSize: 16,
            fontFamily: 'Pretendard-Regular',
            color: palette.neutral[500],
          }}
        />
      )}
    </View>
  );
};
export default CustomCheckBox;
