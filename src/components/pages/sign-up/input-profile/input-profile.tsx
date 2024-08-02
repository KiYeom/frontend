import { View, Text } from 'react-native';

import React, { useCallback, useEffect } from 'react';
import Button from '../../../button/button';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
import { storage } from '../../../../utils/storageUtils';
import { NICKNAME, GENDER, BIRTHDATE } from '../../../../constants/Constants';
const InputProfile: React.FC<any> = ({ navigation }) => {
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState<'여성' | '남성'>();
  const [openModal, setOpenModal] = React.useState(false);
  const [birthDate, setBirthdate] = React.useState<Date>();

  const getName = async () => {
    //const username = await AsyncStorage.getItem('name');
    const username = storage.getString(NICKNAME); //유저 이름 가져옴
    if (username) setName(username);
  };

  const availableBtn = (): boolean => {
    if (name && gender && birthDate) {
      return true;
    } else return false;
  };

  const saveProfile = async () => {
    if (name && birthDate && gender) {
      const res = await updateUserProfile({
        nickname: name,
        gender: `${gender}`,
        birthdate: `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`,
      });
      if (res) {
        //navigation.navigate('SettingStackNavigator', { screen: 'EditUserInfo' });
        //navigation.navigate('BottomTabNavigator', { screen: 'Home' });
        //await AsyncStorage.setItem('gender', gender);
        storage.set(GENDER, gender);
        /*await AsyncStorage.setItem(
          'birthdate',
          `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`,
        );*/
        storage.set(
          BIRTHDATE,
          `${birthDate.getFullYear()}-${String(birthDate.getMonth() + 1).padStart(2, '0')}-${String(birthDate.getDate()).padStart(2, '0')}`,
        );
      } else {
        alert('프로필 저장에 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    getName();
  }, []);

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
        <Button title="다음" disabled={!availableBtn()} primary={true} onPress={saveProfile} />
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
