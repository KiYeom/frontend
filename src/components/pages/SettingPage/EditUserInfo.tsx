import { css } from '@emotion/native';
import React from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { userEditInfo } from '../../../apis/userEditInfo'; //api 수정해야 함
import palette from '../../../assets/styles/theme';
import { TGender } from '../../../constants/types';
import {
  getUserBirthdate,
  getUserGender,
  getUserNickname,
  setUserInfo,
} from '../../../utils/storageUtils';
import { validateBirth } from '../../../utils/ValidateBirth';
import { validateName } from '../../../utils/ValidateName';
import Button from '../../button/button';
import Input from '../../input/input';
import { ContentContainer, CTAContainer } from '../sign-up/input-name/input-name.styles';
import {
  BtnLabel,
  ButtonGroup,
  FormContainer,
  GenderButton,
  Label,
} from '../sign-up/input-profile/input-profile.styles';
//설정 - 프로필 수정 화면

//date가 존재할 경우 'yyyy.mm.dd' 형태로 바꾸는 함수
const formatBirthDate = (dateString: string | undefined): string | undefined => {
  if (!dateString) {
    return undefined;
  }
  return dateString.replace(/-/g, '.');
};

const EditUserInfo: React.FC = ({ navigation }) => {
  //FIX: 생년월일 클릭 시 에러 발생
  const [name, setName] = React.useState<string>(getUserNickname() + '');
  const [gender, setGender] = React.useState<TGender | undefined>(getUserGender());
  const [birthDate, setBirthDate] = React.useState<string | undefined>(
    formatBirthDate(getUserBirthdate()),
  );
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);

  const handleDateChange = (text: string) => {
    let formatted = text.replace(/\D/g, '');

    // 형식이 YYYY.MM.DD 로 맞춰지도록 수정
    if (formatted.length > 4) {
      formatted = formatted.slice(0, 4) + '.' + formatted.slice(4);
    }
    if (formatted.length > 7) {
      formatted = formatted.slice(0, 7) + '.' + formatted.slice(7);
    }
    // 최대 10자리로 자르기 (YYYY.MM.DD)
    if (formatted.length > 10) {
      formatted = formatted.slice(0, 10);
    }
    setBirthDate(formatted);
  };

  const editUserInfo = () => {
    setLoading(true);
    userEditInfo({
      nickname: name,
      gender: gender ?? null,
      birthdate:
        birthDate && validateBirth(birthDate) === 'correct'
          ? `${birthDate.split('.')[0]}-${birthDate.split('.')[1]}-${birthDate.split('.')[2]}`
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
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={css`
          flex: 1;
        `}>
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
              keyboardType="numeric"
              placeholder="1990.01.01"
              status={validateBirth(birthDate)}
              message="생년월일(8자)을 알려주세요!"
              withMessage={true}
              onChange={(text) => handleDateChange(text)}
              value={birthDate}
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
            disabled={
              !(validateName(name + '') === 'correct') ||
              loading ||
              !(validateBirth(birthDate) === 'correct')
            }
            primary={true}
            onPress={() => editUserInfo()}
          />
        </CTAContainer>
      </View>
    </KeyboardAwareScrollView>
  );
};
export default EditUserInfo;
