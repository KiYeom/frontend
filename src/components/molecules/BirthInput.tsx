import React from 'react';
import palette from '../../assets/styles/theme';
import Input from '../input/input';
import DatePickerModal from '../modals/date-picker-modal';
import { FormContainer, Label } from '../pages/sign-up/input-profile/input-profile.styles';

const BirthInput: React.FC<any> = ({ birthDate, setBirthDate }): any => {
  const [openModal, setOpenModal] = React.useState(false);

  return (
    <FormContainer>
      <Label>생년월일</Label>
      <Input
        placeholder={'생년월일 입력'}
        showRightIcon={true}
        status="disabled"
        rightIcon="arrow-down"
        onPressContainer={() => setOpenModal(true)}
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
        onChange={setBirthDate}
      />
    </FormContainer>
  );
};
export default BirthInput;
