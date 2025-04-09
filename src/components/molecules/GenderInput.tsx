import React from 'react';
import {
  BtnLabel,
  ButtonGroup,
  FormContainer,
  GenderButton,
  Label,
} from '../../pages/sign-up/input-profile/input-profile.styles';

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
