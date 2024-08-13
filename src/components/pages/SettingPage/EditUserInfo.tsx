import React, { useEffect } from 'react';
import Button from '../../button/button';
import palette from '../../../assets/styles/theme';
import { Label } from '../sign-up/input-profile/input-profile.styles';
import Input from '../../input/input';
import { FormContainer } from '../sign-up/input-profile/input-profile.styles';
import { ContentContainer } from '../sign-up/input-name/input-name.styles';
import { validateName } from '../../../utils/ValidateName';
import { CTAContainer } from '../sign-up/input-name/input-name.styles';
import { userEditInfo } from '../../../apis/userEditInfo'; //api 수정해야 함
import {
  getUserBirthdate,
  getUserGender,
  getUserNickname,
  setUserInfo,
} from '../../../utils/storageUtils';
import { ButtonGroup } from '../sign-up/input-profile/input-profile.styles';
import { GenderButton } from '../sign-up/input-profile/input-profile.styles';
import { BtnLabel } from '../sign-up/input-profile/input-profile.styles';
import DatePickerModal from '../../modals/date-picker-modal';
import { TGender } from '../../../constants/types';
import { TouchableWithoutFeedback } from 'react-native';
import { Keyboard } from 'react-native';
//설정 - 프로필 수정 화면

//date가 존재할 경우 Date 형태로 바꾸는 함수
const formatBirthDate = (dateString: string | undefined): Date | undefined => {
  if (!dateString) {
    return undefined;
  }
  const [year, month, day] = dateString.split('-').map(Number);
  const dateObject = new Date(year, month - 1, day);
  return dateObject;
};

const EditUserInfo: React.FC = ({ navigation }) => {
  //FIX: 생년월일 클릭 시 에러 발생
  const [name, setName] = React.useState<string>(getUserNickname() + '');
  const [gender, setGender] = React.useState<TGender | undefined>(getUserGender());
  const [birthDate, setBirthDate] = React.useState<Date | undefined>(
    formatBirthDate(getUserBirthdate()),
  );
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const editUserInfo = () => {
    setLoading(true);
    userEditInfo({
      nickname: name,
      gender: gender ?? null,
      birthdate: birthDate
        ? `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`
        : null,
    })
      .then((res) => {
        if (!res) {
          alert('변경 사항이 저장되지 않았습니다');
        } else {
          setUserInfo(res.nickname, res.birthdate, res.gender);
          navigation.goBack();
          setLoading(false);
        }
      })
      .catch((err) => {
        alert('네트워크가 원활하지 않습니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
      });
  };

  return (
    <>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ContentContainer>
          <FormContainer>
            <Label>이름</Label>
            <Input
              placeholder="내용을 입력해주세요."
              status={validateName(name + '')}
              message="2~15 글자 사이의 닉네임을 지어주세요!"
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
      </TouchableWithoutFeedback>
      <CTAContainer>
        <Button
          title="저장"
          disabled={!(validateName(name + '') === 'correct') || loading}
          primary={true}
          onPress={() => editUserInfo()}
        />
      </CTAContainer>
      <DatePickerModal
        modalVisible={openModal}
        onClose={() => setOpenModal(false)}
        onChange={setBirthDate}
      />
    </>
  );
};
export default EditUserInfo;
