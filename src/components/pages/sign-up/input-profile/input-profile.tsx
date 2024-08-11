import React, { useEffect } from 'react';
import Button from '../../../button/button';
import {
  Annotation,
  ContentContainer,
  CTAContainer,
  Title,
  TitleContaienr,
} from '../input-name/input-name.styles';
import { BtnLabel, ButtonGroup, FormContainer, GenderButton, Label } from './input-profile.styles';
import Input from '../../../input/input';
import DatePickerModal from '../../../modals/date-picker-modal';
import palette from '../../../../assets/styles/theme';
import { updateUserProfile } from '../../../../apis/auth';
import { TGender } from '../../../../constants/types';
import { getUserNickname, setInfoWhenLogin } from '../../../../utils/storageUtils';
import { UseSigninStatus } from '../../../../utils/signin-status';
import { UseRightStatus } from '../../../../utils/right-status';

const InputProfile: React.FC<any> = ({ navigation }) => {
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState<TGender>();
  const [openModal, setOpenModal] = React.useState(false);
  const [birthDate, setBirthdate] = React.useState<Date>();
  const [loading, setLoading] = React.useState(false);
  const [firstLoaded, setFirstLoaded] = React.useState(false);
  const { setSigninStatus } = UseSigninStatus();
  const { RightStatus, setRightStatus } = UseRightStatus();

  const getName = async () => {
    const username = getUserNickname(); //유저 이름 가져옴
    if (username) setName(username);
  };

  const availableBtn = (): boolean => {
    if (name && gender && birthDate) {
      return true;
    } else return false;
  };

  const saveProfile = async (): Promise<boolean> => {
    if (name) {
      const res = await updateUserProfile({
        nickname: name,
        gender: gender ?? null,
        birthdate: birthDate
          ? `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`
          : null,
      });

      if (res) {
        setInfoWhenLogin(
          '' + res.nickname,
          res.birthdate,
          res.gender,
          res.accessToken,
          res.refreshToken,
          res.notice,
        );
        setSigninStatus(true);
        return true;
      }
      return false;
    }
    return false;
  };

  useEffect(() => {
    setLoading(true);
    if (firstLoaded) {
      saveProfile()
        .then((res) => {
          if (!res) {
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      getName()
        .then((res) => {
          setLoading(false);
          setFirstLoaded(true);
        })
        .catch((err) => {
          alert('이름을 가져오는데 실패했습니다. 다시 시도해주세요.');
          navigation.goBack();
          setLoading(false);
          setFirstLoaded(true);
        });
    }
  }, [RightStatus]);

  return (
    <>
      <TitleContaienr>
        <Annotation>{name}님을 더 잘 이해하고 싶어요.</Annotation>
        <Title>쿠키에게{'\n'}정보를 알려주세요.</Title>
      </TitleContaienr>
      <ContentContainer>
        <FormContainer>
          <Label>생년월일</Label>
          <Input
            placeholder="생년월일 입력"
            showRightIcon={true}
            status="disabled"
            rightIcon="arrow-down"
            onPressContainer={() => {
              console.log('모달 열리기');
              setOpenModal(true);
            }}
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
          title="다음"
          disabled={!availableBtn() || loading}
          primary={true}
          onPress={saveProfile}
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

export default InputProfile;
