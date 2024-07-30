import React from 'react';
import { View, Text } from 'react-native';
import { Label } from '../pages/sign-up/input-profile/input-profile.styles';
import Input from '../input/input';
import palette from '../../assets/styles/theme';
import { USER } from '../../constants/Constants';
import { FormContainer } from '../pages/sign-up/input-profile/input-profile.styles';
const BirthInput: React.FC<any> = () => {
  const [birthDate, setBirthdate] = React.useState<Date>();
  const [openModal, setOpenModal] = React.useState(false);
  return (
    <FormContainer>
      <Label>생년월일</Label>
      <Input
        placeholder={USER.BIRTHDATE ? USER.BIRTHDATE : '생년월일 입력'}
        showRightIcon={true}
        status="disabled"
        rightIcon="arrow-down"
        onPress={() => setOpenModal(true)}
        value={USER.BIRTHDATE ? USER.BIRTHDATE : ''}
        styles={{ text: { color: palette.neutral[900] } }}
      />
    </FormContainer>
  );
};
export default BirthInput;
