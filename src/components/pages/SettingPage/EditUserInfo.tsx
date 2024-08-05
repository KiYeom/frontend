import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import NameInput from '../../molecules/NameInput';
import BirthInput from '../../molecules/BirthInput';
import GenderInput from '../../molecules/GenderInput';
import Button from '../../button/button';
import palette from '../../../assets/styles/theme';
import { getUserInfo } from '../../../apis/userInfo';
import { Label } from '../sign-up/input-profile/input-profile.styles';
import { USER } from '../../../constants/Constants';
import Input from '../../input/input';
import { FormContainer } from '../sign-up/input-profile/input-profile.styles';
import { useEffect } from 'react';
import { ContentContainer } from '../sign-up/input-name/input-name.styles';
import { validateName } from '../../../utils/ValidateName';
import { CTAContainer } from '../sign-up/input-name/input-name.styles';
import { userEditInfo } from '../../../apis/userEditInfo'; //api 수정해야 함
import { storage } from '../../../utils/storageUtils';
import { NICKNAME, GENDER, BIRTHDATE } from '../../../constants/Constants';
import { ButtonGroup } from '../sign-up/input-profile/input-profile.styles';
import { GenderButton } from '../sign-up/input-profile/input-profile.styles';
import { BtnLabel } from '../sign-up/input-profile/input-profile.styles';
import DatePickerModal from '../../modals/date-picker-modal';
//설정 - 프로필 수정 화면

//date가 존재할 경우 Date 형태로 바꾸는 함수
const formatBirth = (dateString: string): Date | undefined => {
  console.log(dateString);
  if (dateString === 'unknown') {
    //storage에 unknown이 저장되어있을 경우
    return undefined;
  }
  const [year, month, day] = dateString.split('-').map(Number);
  const dateObject = new Date(year, month - 1, day);
  return dateObject;
};

const EditUserInfo: React.FC = ({ navigation }: any) => {
  const [name, setName] = React.useState<string>(storage.getString(NICKNAME));
  const [gender, setGender] = React.useState<'여성' | '남성'>(storage.getString(GENDER));
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [birthDate, setBirthdate] = React.useState<Date | undefined>(
    formatBirth(storage.getString(BIRTHDATE)),
  );
  return (
    <>
      <ContentContainer>
        <FormContainer>
          <Label>이름</Label>
          <Input
            placeholder="내용을 입력해주세요."
            status={validateName(name)}
            message="2~15 글자 사이의 이름을 지어주세요!"
            withMessage={true}
            onChange={(text) => {
              if (text.length < 15) setName(text);
            }}
            value={name}
          />
        </FormContainer>
        <FormContainer>
          <Label>생년월일</Label>
          <Input
            placeholder="생년월일 입력"
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
        </FormContainer>
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
      </ContentContainer>

      <CTAContainer>
        <Button
          title="저장"
          disabled={!(validateName(name) === 'correct')}
          primary={true}
          onPress={async () => {
            const res = await userEditInfo({
              nickname: name,
              birthdate: birthDate
                ? `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`
                : 'unknown',
              gender: gender ?? null,
            });
            if (res) {
              navigation.navigate('BottomTabNavigator', { screen: 'Home' });
            } else {
              alert('변경 사항이 저장되지 않았습니다');
            }
          }}
        />
      </CTAContainer>
      <DatePickerModal
        modalVisible={openModal}
        onClose={() => setOpenModal(false)}
        onChange={setBirthdate}
      />
    </>
  );
};
export default EditUserInfo;
