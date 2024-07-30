import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import NameInput from '../../molecules/NameInput';
import BirthInput from '../../molecules/BirthInput';
import GenderInput from '../../molecules/GenderInput';
import Button from '../../button/button';
import palette from '../../../assets/styles/theme';
import { getUserInfo } from '../../../apis/userInfo';
import useNicknameState from '../../../store/nicknameState';
import { useEffect } from 'react';
//설정 - 프로필 수정 화면

const EditUserInfo: React.FC = () => {
  const [name, setName] = React.useState('');
  const [gender, setGender] = React.useState('');
  const [birthDate, setBirthdate] = React.useState<Date>();
  const validateName = (name: string): 'error' | 'default' | 'correct' => {
    if (name.length !== 0 && (name.length < 2 || name.length > 15)) return 'error';
    else if (name.length >= 2 && name.length <= 15) return 'correct';
    else return 'default';
  };
  useEffect(() => {
    const saveUserInfo = async () => {
      try {
        const data = await getUserInfo(); //유저의 정보를 api로 가지고 와서
        if (data !== false) {
          setName(data.nickname);
          setGender(data.gender);
          //setBirthdate(data.birthdate);
        } else {
          console.log('유저 정보를 가지고 올 수가 없다.');
        }
      } catch (error) {
        console.log(error);
      }
    };
    saveUserInfo();
  }, []);
  return (
    <View style={styles.container}>
      <NameInput name={name} setName={setName} />
      <BirthInput />
      <GenderInput />
      <Button
        title="저장"
        disabled={!name}
        primary={true}
        onPress={() => console.log('버튼 눌림')}
      />
    </View>
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
