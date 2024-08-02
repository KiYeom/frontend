import React from 'react';
import { View, Text } from 'react-native';
import { Label } from '../pages/sign-up/input-profile/input-profile.styles';
import Input from '../input/input';
import palette from '../../assets/styles/theme';
import { USER } from '../../constants/Constants';
import { BIRTHDATE } from '../../constants/Constants';
import { FormContainer } from '../pages/sign-up/input-profile/input-profile.styles';
import DatePickerModal from '../modals/date-picker-modal';
import { storage } from '../../utils/storageUtils';

const BirthInput: React.FC<any> = () => {
  const [birthDate, setBirthdate] = React.useState<Date>();
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <FormContainer>
      <Label>생년월일</Label>
      <Input
        placeholder={'생년월일 입력'}
        showRightIcon={true}
        status="disabled"
        rightIcon="arrow-down"
        onPress={() => setOpenModal(true)}
        value={
          birthDate
            ? birthDate?.getFullYear() +
              '.' +
              String(birthDate.getMonth() + 1).padStart(2, '0') +
              '.' +
              String(birthDate.getDate()).padStart(2, '0')
            : undefined
        }
        styles={{ text: { color: palette.neutral[900] } }}
      />
      <DatePickerModal
        modalVisible={openModal}
        onClose={() => setOpenModal(false)}
        onChange={setBirthdate}
      />
    </FormContainer>
  );
};
export default BirthInput;
