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
const GenderInput: React.FC<any> = ({ gender, setGender }): any => {
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

export default GenderInput;
