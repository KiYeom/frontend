import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import palette from '../../assets/styles/theme';
import { Label } from '../pages/sign-up/input-profile/input-profile.styles';
import {
  ButtonGroup,
  GenderButton,
  BtnLabel,
} from '../pages/sign-up/input-profile/input-profile.styles';
import { FormContainer } from '../pages/sign-up/input-profile/input-profile.styles';
const GenderInput: React.FC<any> = () => {
  const [gender, setGender] = React.useState<'여성' | '남성'>();
  return (
    <FormContainer>
      <Label>성별</Label>
      <ButtonGroup>
        <GenderButton
          activeOpacity={1}
          selected={gender === '여성'}
          onPress={() => setGender('여성')}>
          <BtnLabel selected={gender === '여성'}>여성</BtnLabel>
        </GenderButton>
        <GenderButton
          activeOpacity={1}
          selected={gender === '남성'}
          onPress={() => setGender('남성')}>
          <BtnLabel selected={gender === '남성'}>남성</BtnLabel>
        </GenderButton>
      </ButtonGroup>
    </FormContainer>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 100,
  },
  btnContainer: {
    flexDirection: 'row',
    //backgroundColor: 'blue',
    justifyContent: 'space-between',
    width: '100%',
  },
  btns: {
    borderRadius: 10,
    width: '45%',
    backgroundColor: '#F6F6F6',
  },
});
export default GenderInput;
