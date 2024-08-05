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
import { FormContainer } from './DeactivateReason.style';
import { useEffect } from 'react';
import { ContentContainer } from '../sign-up/input-name/input-name.styles';
import { validateName } from '../../../utils/ValidateName';
import { CTAContainer } from '../sign-up/input-name/input-name.styles';
import { userEditInfo } from '../../../apis/userEditInfo'; //api 수정해야 함
import { storage } from '../../../utils/storageUtils';
import { NICKNAME, GENDER, BIRTHDATE } from '../../../constants/Constants';
//설정 - 프로필 수정 화면

//date가 존재할 경우 Date 형태로 바꾸는 함수
const formatBirth = (dateString: string) => {
  if (dateString === 'unknown') {
    const dateObject = new Date(2000, 0, 1); //디폴트 2000-01-01
    return dateObject;
  }
  const [year, month, day] = dateString.split('.').map(Number);
  const dateObject = new Date(year, month - 1, day);
  return dateObject;
};

const EditUserInfo: React.FC = ({ navigation }: any) => {
  const [name, setName] = React.useState<string>(storage.getString(NICKNAME));
  const [gender, setGender] = React.useState<'여성' | '남성'>(storage.getString(GENDER));
  return (
    <>
      <ContentContainer style={styles.container}>
        <>
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
        </>
        {/*<BirthInput birthDate={birthDate} setBirthDate={setBirthDate} />*/}
        <GenderInput gender={gender} setGender={setGender} />
      </ContentContainer>
      <CTAContainer>
        <Button
          title="저장"
          disabled={!(validateName(name) === 'correct')}
          primary={true}
          onPress={async () => {
            const res = await userEditInfo({
              nickname: name,
              birthdate: null,
              gender: gender ?? null,
            });
            if (res) {
              navigation.navigate('BottomTabNavigator', { screen: 'Home' });
            }
          }}
        />
      </CTAContainer>
    </>
  );
};
export default EditUserInfo;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: 'white',
  },
});
