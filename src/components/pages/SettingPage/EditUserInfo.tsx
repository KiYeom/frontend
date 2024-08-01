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
import { useEffect } from 'react';
import { ContentContainer } from '../sign-up/input-name/input-name.styles';
import { validateName } from '../../../utils/ValidateName';
import { CTAContainer } from '../sign-up/input-name/input-name.styles';
import { userEditInfo } from '../../../apis/userEditInfo'; //api 수정해야 함
import { storage } from '../../../utils/storageUtils';
import { NICKNAME } from '../../../constants/Constants';
//설정 - 프로필 수정 화면

const EditUserInfo: React.FC = () => {
  const [name, setName] = React.useState('');
  /*useEffect(() => {
    const saveUserInfo = async () => {
      try {
        const data = await getUserInfo(); //유저의 정보를 api로 가지고 와서
        if (data !== false) {
          setName(data.nickname);
        } else {
          console.log('유저 정보를 가지고 올 수가 없다.');
        }
      } catch (error) {
        console.log(error);
      }
    };
    saveUserInfo();
  }, []);*/
  return (
    <>
      <ContentContainer style={styles.container}>
        <NameInput name={storage.getString(NICKNAME)} setName={setName} />
        <BirthInput />
        <GenderInput />
      </ContentContainer>
      <CTAContainer>
        <Button
          title="저장"
          disabled={!(validateName(name) === 'correct')}
          primary={true}
          onPress={() =>
            userEditInfo({ nickname: name, birthdate: USER.BIRTHDATE, gender: USER.GENDER })
          }
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
