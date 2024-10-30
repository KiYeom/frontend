import { css } from '@emotion/native';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { updateUserProfile } from '../../../../apis/auth';
import palette from '../../../../assets/styles/theme';
import { TGender } from '../../../../constants/types';
import { UseRightStatus } from '../../../../utils/right-status';
import { UseSigninStatus } from '../../../../utils/signin-status';
import { getUserNickname, setInfoWhenLogin } from '../../../../utils/storageUtils';
import { validateBirth } from '../../../../utils/ValidateBirth';
import Button from '../../../button/button';
import Input from '../../../input/input';
import {
  Annotation,
  ContentContainer,
  CTAContainer,
  Title,
  TitleContainer,
} from '../input-name/input-name.styles';
import { BtnLabel, ButtonGroup, FormContainer, GenderButton, Label } from './input-profile.styles';

const InputProfile: React.FC<any> = ({ navigation }) => {
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState<TGender>();
  const [birthDate, setBirthdate] = React.useState<string>('');
  const [loading, setLoading] = React.useState(false);
  const [firstLoaded, setFirstLoaded] = React.useState(false);
  const { setSigninStatus } = UseSigninStatus();
  const { RightStatus, setRightStatus } = UseRightStatus();

  const getName = async () => {
    const username = getUserNickname(); //유저 이름 가져옴
    if (username) setName(username);
  };

  const availableBtn = (): boolean => {
    if (name && gender && validateBirth(birthDate) === 'correct') {
      return true;
    } else return false;
  };

  const saveProfile = async (): Promise<boolean> => {
    if (name) {
      const res = await updateUserProfile({
        nickname: name,
        gender: gender ?? null,
        birthdate:
          validateBirth(birthDate) === 'correct'
            ? `${birthDate.split('.')[0]}-${birthDate.split('.')[1]}-${birthDate.split('.')[2]}`
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
    setBirthdate(formatted);
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        style={css`
          flex: 1;
        `}>
        <TitleContainer>
          <Annotation>{name}님을 더 잘 이해하고 싶어요.</Annotation>
          <Title>쿠키에게{'\n'}정보를 알려주세요.</Title>
        </TitleContainer>
        <ContentContainer>
          <FormContainer>
            <Label>생년월일</Label>
            <Input
              keyboardType="numeric"
              placeholder="1990.01.01"
              status={validateBirth(birthDate)}
              message="생년월일(8자)을 알려주세요!"
              withMessage={true}
              onChange={(text) => handleDateChange(text)}
              styles={{ text: { color: palette.neutral[900] } }}
              value={birthDate}
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
      </View>
    </KeyboardAwareScrollView>
  );
};

export default InputProfile;
